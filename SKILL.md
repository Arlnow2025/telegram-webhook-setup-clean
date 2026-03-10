---
name: nmap-mcp
description: >
  Network scanning MCP server wrapping nmap. Provides 14 purpose-built tools
  for host discovery, port scanning (SYN/TCP/UDP), service & OS detection, NSE
  script execution, and vulnerability scanning. Returns structured JSON output.
  Includes scope enforcement (CIDR allowlist), audit logging, and scan
  persistence. Use when performing network security audits, asset discovery,
  or recon on authorized networks.
---

# nmap-mcp Skill

MCP server that exposes nmap as structured tools with scope enforcement,
audit logging, and persistent scan results.

## Prerequisites

- nmap installed (`/usr/bin/nmap` or configure path in `config.yaml`)
- Python 3.10+ with `fastmcp`, `python-nmap`, `pyyaml`
- For SYN/OS/ARP scans: `cap_net_raw` capability on the nmap binary (see Setup)

## Setup

```bash
# 1. Install Python dependencies
pip install fastmcp python-nmap pyyaml

# 2. Grant nmap raw socket capability (required for SYN + OS detection)
#    Only needs to be done once. Re-run after nmap upgrades.
sudo setcap cap_net_raw+ep $(which nmap)

# 3. Verify it worked
getcap $(which nmap)
# Expected: /usr/bin/nmap cap_net_raw=ep

# 4. Configure scope (edit config.yaml — set your allowed CIDRs)
# 5. Register with mcporter (see mcporter.json entry below)
```

## mcporter.json Entry

```json
{
  "nmap": {
    "command": "python3",
    "args": ["-u", "/root/.openclaw/workspace/skills/nmap-mcp/server.py"],
    "type": "stdio",
    "env": {
      "NMAP_CONFIG": "/root/.openclaw/workspace/skills/nmap-mcp/config.yaml"
    }
  }
}
```

## Configuration (config.yaml)

```yaml
# Scope enforcement — targets outside these CIDRs are rejected
allowed_cidrs:
  - "127.0.0.0/8"       # loopback — always useful for testing
  - "192.168.1.0/24"    # your local network

# Paths (defaults to relative paths if omitted)
audit_log: "./audit.log"
scan_dir: "./scans"
nmap_bin: "/usr/bin/nmap"

# Default scan timeouts (seconds)
timeouts:
  quick: 120
  standard: 300
  deep: 600
```

## Tools

| Tool | Purpose | Privileges |
|------|---------|-----------|
| `nmap_ping_scan` | ICMP+TCP host discovery | none |
| `nmap_arp_discovery` | ARP host discovery (LAN) | cap_net_raw |
| `nmap_top_ports` | Fast scan of N common ports | none |
| `nmap_syn_scan` | SYN half-open port scan | cap_net_raw |
| `nmap_tcp_scan` | Full TCP connect port scan | none |
| `nmap_udp_scan` | UDP port scan | cap_net_raw |
| `nmap_service_detection` | Service/version detection | none |
| `nmap_os_detection` | OS fingerprinting | cap_net_raw |
| `nmap_script_scan` | Run named NSE scripts | none |
| `nmap_vuln_scan` | Run vuln NSE category | none |
| `nmap_full_recon` | SYN+service+OS+scripts | cap_net_raw |
| `nmap_custom_scan` | Arbitrary flags (scoped+logged) | varies |
| `nmap_list_scans` | List recent saved scans | none |
| `nmap_get_scan` | Retrieve scan by ID | none |

## Usage Examples

```bash
# Discover live hosts on local network
mcporter call nmap.nmap_ping_scan(target: "192.168.1.0/24")

# Find open ports on a server
mcporter call nmap.nmap_top_ports(target: "192.168.1.20", count: 100)

# Full reconnaissance on a target
mcporter call nmap.nmap_full_recon(target: "192.168.1.20")

# Check for vulnerabilities
mcporter call nmap.nmap_vuln_scan(target: "192.168.1.20")

# List recent scans
mcporter call nmap.nmap_list_scans(limit: 10)

# Retrieve a specific scan
mcporter call nmap.nmap_get_scan(scan_id: "20260311_123456_a1b2c3")
```

## Security Notes

- **Scope enforcement**: Only scan networks you own/have permission for. Configure `allowed_cidrs` strictly.
- **Audit logging**: All scans logged to `audit.log` — review periodically.
- **Capability vs Root**: `setcap cap_net_raw+ep` gives nmap raw socket access without full root — safer than sudoers.
- **Legal compliance**: Unauthorized network scanning is illegal in many jurisdictions.

## Running Tests

```bash
python3 -m pytest tests/ -v
# 28 tests covering scope enforcement, audit logging,
# scan persistence, injection guards, and live scans
```

## Integration with OpenClaw

Once installed and configured, all 14 nmap tools are automatically available to OpenClaw agents via mcporter. Just ask naturally:

- "Scan 10.35.251.0/24 for open ports"
- "Run a full recon on 10.35.251.10"
- "What services are running on 10.35.251.50?"
- "Check 10.35.251.25 for known vulnerabilities"

OpenClaw will automatically pick the appropriate tool and return structured JSON results.

## Next Steps

- [ ] Test with your local network (start with `nmap_ping_scan`)
- [ ] Review audit logs periodically
- [ ] Update `allowed_cidrs` to match your actual network range
- [ ] Create custom NSE script workflows if needed

---

**All tools installed, configured, and ready to use!** ✅