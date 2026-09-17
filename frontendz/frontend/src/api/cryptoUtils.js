/**
 * Cryptographic utility functions for VouchGrid:
 * - Computes SHA-256 hashes using browser Web Crypto API
 * - Computes decision_hash: SHA-256(contribution_id + verifier_id + decision + comment + verified_at)
 * - Computes activity hash chain: record_hash = SHA-256(payload_json + prev_hash)
 * - Chain validation algorithm to detect DB tampering
 */

export async function computeSha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes decision hash for verification records
 */
export async function computeDecisionHash({ contributionId, verifierId, decision, comment, verifiedAt }) {
  const payload = `${contributionId}:${verifierId}:${decision}:${comment || ''}:${verifiedAt}`;
  return await computeSha256(payload);
}

/**
 * Computes hash chain record hash
 */
export async function computeRecordHash(payloadJson, prevHash) {
  return await computeSha256(`${payloadJson}:${prevHash || '0000000000000000000000000000000000000000000000000000000000000000'}`);
}

/**
 * Validates a list of activity entries to ensure tamper-evident hash-chain integrity.
 * Returns { valid: boolean, brokenIndex: number | null }
 */
export async function verifyChainIntegrity(activities) {
  if (!activities || activities.length === 0) {
    return { valid: true, brokenIndex: null };
  }

  for (let i = 0; i < activities.length; i++) {
    const act = activities[i];
    const prevHash = i === 0 
      ? (act.prevHash || '0000000000000000000000000000000000000000000000000000000000000000')
      : activities[i - 1].recordHash;

    if (act.prevHash !== prevHash) {
      return { valid: false, brokenIndex: i, reason: 'Previous hash mismatch' };
    }

    const calculatedHash = await computeRecordHash(JSON.stringify(act.payload), act.prevHash);
    if (calculatedHash !== act.recordHash) {
      return { valid: false, brokenIndex: i, reason: 'Record hash content signature invalid' };
    }
  }

  return { valid: true, brokenIndex: null };
}
