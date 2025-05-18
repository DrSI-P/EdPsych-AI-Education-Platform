# DNS Configuration for EdPsych Connect

This document outlines the DNS configuration required to connect the EdPsych-AI-Education-Platform to the edpsychconnect.com domain.

## Domain Information

- Primary Domain: edpsychconnect.com
- Alternate Domains: www.edpsychconnect.com

## DNS Records

### A Records

| Name | Value | TTL |
|------|-------|-----|
| @ | 76.76.21.21 | 3600 |
| www | 76.76.21.21 | 3600 |

### CNAME Records

| Name | Value | TTL |
|------|-------|-----|
| api | cname.vercel-dns.com | 3600 |
| _vercel | cname.vercel-dns.com | 3600 |

### TXT Records

| Name | Value | TTL |
|------|-------|-----|
| @ | v=spf1 include:_spf.vercel.com ~all | 3600 |
| _dmarc | v=DMARC1; p=none; rua=mailto:admin@edpsychconnect.com | 3600 |

### MX Records

| Name | Priority | Value | TTL |
|------|----------|-------|-----|
| @ | 10 | mx1.vercel-smtp.com | 3600 |
| @ | 20 | mx2.vercel-smtp.com | 3600 |

## SSL Configuration

SSL is automatically managed by Vercel. The platform will provision and renew SSL certificates for all configured domains.

## Nameservers

If using Vercel for DNS management, update your domain's nameservers to:

- ns1.vercel-dns.com
- ns2.vercel-dns.com

## Domain Verification

To verify domain ownership with Vercel:

1. Add a TXT record with name: `_vercel`
2. Value will be provided in the Vercel dashboard when adding the domain

## Troubleshooting

If DNS propagation issues occur:

1. Verify all DNS records are correctly configured
2. Check nameserver configuration at your domain registrar
3. Use tools like [dnschecker.org](https://dnschecker.org) to verify propagation
4. Allow up to 48 hours for full DNS propagation

## Monitoring

Once configured, domain health can be monitored in the Vercel dashboard under Domains section.
