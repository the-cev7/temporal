# temporal for saga-pattern

## Run with docker
- [x] svc-a (golang) golang:1.22-alpine3.18
- [x] svc-b (nestJS) node:20-bullseye-slim
- [x] orchestration (nestJS) node:20-bullseye-slim

```bash
docker-compose up -d
# Setup golang
docker-compose exec svca sh
go mod tidy

# Setup nestJs
docker-compose exec svcb sh
yarn

# Setup client orchestrations
docker-compose exec orchestration sh
yarn
```

## Context
```
- C = $100
- A = $0
- B = $0

C -> A = $30
C -> B = $40
-----------------
- C = $30
- A = $30
- B = $40
```
![flow context](context-flow.png "Title")


## Development
- Inside `orchestration` start api

```bash
docker-compose exec orchestration sh
yarn start
```
```typescript
// Start trigger to svc-A
const handleA = await this.temporalClient.start(
    'transferWorkflow',
    {
        args: [paramsA], // pass args to activities of svc-a
        taskQueue: taskQueueA,  // use queueName for trigger to svc-a
        workflowId: 'wf-id-' + Math.floor(Math.random() * 1000),
    },
);
```

- Inside `svca` start worker A

```bash
docker-compose exec svca sh
go run cmd/worker.go
```

- Inside `svcb` start worker B

```bash
docker-compose exec svcb sh
yarn start
```

- Access on browser
http://localhost:3000/transfers


## View dashboard temporal

http://localhost:8088/
