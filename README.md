\# VouchGrid



Verified Developer Collaboration and Professional Growth Platform



VouchGrid is a GitHub-native platform that helps developers showcase verified contributions, skill growth, and collaboration history through GitHub evidence and peer verification workflows.



\## Modules



| Module | Status |

|----------|----------|

| Repository Setup | ✅ Completed |

| Identity \& Authentication | ✅ MVP Complete |

| Projects \& Membership | ✅ MVP Complete |

| Repositories \& Modules | ✅ MVP Complete |

| GitHub Sync | ✅ MVP Complete |

| Skill Engine | ✅ MVP Complete |

| Contributions | ✅ MVP Complete |

| Verification | ✅ MVP Complete |

| Reassignment \& Notifications | ⏳ Not Started |

| Activity Log | ⏳ Not Started |

| Profiles \& Trust Signals | ✅ MVP Complete |

| Public Verification | ✅ MVP Complete |

| WebSocket Layer | ⏳ Not Started |

| Frontend Completion | ⏳ Not Started |

| Optional Modules | ⏳ Not Started |

| Test Suite | ⏳ Not Started |

## Backend Demo

Start MySQL and the backend. Configure a GitHub OAuth application with callback
URL `http://localhost:8080/api/auth/github/callback` first.

```powershell
docker compose up -d mysql
Set-Location backend
$env:JWT_SECRET = "demo-secret-key-demo-secret-key-demo-secret"
$env:GITHUB_CLIENT_ID = "your-github-client-id"
$env:GITHUB_CLIENT_SECRET = "your-github-client-secret"
\.\mvnw.cmd spring-boot:run
```

Open `GET http://localhost:8080/api/auth/github` and follow the returned GitHub
authorization URL. The callback registers new GitHub users or logs existing
users in, stores their OAuth connection, and returns a JWT. Send it as
`Authorization: Bearer <token>` for the protected flow:

1. `POST /api/projects` with a project name and description.
2. `POST /api/projects/{projectId}/link-repository` with provider `github`, owner `vouchgrid`, and repository `demo`.
3. `POST /api/github/sync/{projectId}` to import the deterministic mock commit.
4. `POST /api/skills/generate/{userId}` to generate skill evidence.
5. `GET /api/skills/user/{userId}` to display generated profile skills.

Contribution and trust flow:

1. `POST /api/projects/{projectId}/contributions` with a synchronized commit SHA.
2. `POST /api/contributions/{contributionId}/verification` to assign an active project verifier.
3. `POST /api/verifications/{verificationId}/approve` or `/reject` with a comment.
4. `GET /api/profiles/{userId}` for the aggregated profile.
5. `GET /api/public/verify/{publicToken}` for unauthenticated evidence verification.
6. `GET /api/profiles/{userId}/certificate` for the stable certificate JSON export.

The current MVP intentionally excludes notifications, WebSockets, chat, resources,
advanced trust heuristics, and PDF export. The public verification response and
certificate include the commit, contributor, project, verifier, decision, and
decision hash needed for a presentation-quality trust demonstration.

