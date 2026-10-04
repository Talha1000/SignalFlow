# SignalFlow Backup & Disaster Recovery Architecture

This document outlines the backup, retention, and disaster recovery strategy for SignalFlow in enterprise production environments.

---

## 1. Objectives & Metrics

- **Recovery Point Objective (RPO)**: <= 5 minutes (Maximum acceptable data loss window)
- **Recovery Time Objective (RTO)**: <= 30 minutes (Maximum acceptable downtime window)
- **Encryption Standard**: AES-256 at rest, TLS 1.3 in transit

---

## 2. PostgreSQL Database Backup Procedures

### Continuous Archiving & Point-In-Time Recovery (PITR)
Production deployments on managed PostgreSQL (AWS RDS / Supabase / Google Cloud SQL) maintain:
- **Write-Ahead Logging (WAL)**: Streamed continuously to multi-region object storage (S3 / GCS).
- **Automated Daily Snapshots**: Retained for 30 rolling calendar days.
- **Transaction Logs**: Retained for 7 days to enable point-in-time recovery to any individual second within the retention window.

### Scheduled Logical Dump Command
For isolated secondary backup copies or local air-gapped archives:

```bash
# Export compressed, schema-complete database backup
pg_dump "$DATABASE_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="signalflow_backup_$(date +%Y%m%d_%H%M%S).dump"

# Verify backup integrity
pg_restore --list "signalflow_backup_*.dump" > /dev/null
```

---

## 3. Restoration Procedure

1. **Provision Target Environment**:
   Ensure PostgreSQL 15+ is running with extensions enabled.
2. **Apply Base Schema**:
   ```bash
   npx prisma db push
   ```
3. **Restore Data Dump**:
   ```bash
   pg_restore --clean --if-exists --no-owner -d "$DATABASE_URL" signalflow_backup_*.dump
   ```
4. **Run Verification Suite**:
   ```bash
   npx tsx scripts/verify-enterprise.ts
   ```

---

## 4. Multi-Tenant Data Isolation Safeguards

- Every tenant database entity includes a `workspaceId` foreign key with cascade deletion safety.
- Cross-tenant queries are structurally prevented by repository-level where clause scoping (`workspaceId: caller.workspaceId`).
- Backups preserve tenant referential integrity without cross-tenant key pollution.
