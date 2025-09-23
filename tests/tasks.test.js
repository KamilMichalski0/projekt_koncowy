const fs = require('fs');
const path = require('path');
const httpMocks = require('node-mocks-http');

const tasksHandler = require('../api/tasks.js');

const TEST_DB_PATH = path.join(process.cwd(), 'test-db.json');

beforeEach(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
        fs.unlinkSync(TEST_DB_PATH);
    }

    if (fs.existsSync(path.join(process.cwd(), 'db.json'))) {
        fs.unlinkSync(path.join(process.cwd(), 'db.json'));
    }
});

afterEach(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
        fs.unlinkSync(TEST_DB_PATH);
    }

    if (fs.existsSync(path.join(process.cwd(), 'db.json'))) {
        fs.unlinkSync(path.join(process.cwd(), 'db.json'));
    }
});

describe('Tasks API Handler', () => {
    describe('OPTIONS method', () => {
        test('should respond with CORS headers and 200 status', async () => {
            const req = httpMocks.createRequest({
                method: 'OPTIONS'
            });
            const res = httpMocks.createResponse();

            await tasksHandler(req, res);

            expect(res.statusCode).toBe(200);
            expect(res.getHeader('Access-Control-Allow-Origin')).toBe('*');
            expect(res.getHeader('Access-Control-Allow-Methods')).toBe('GET, POST, OPTIONS');
            expect(res.getHeader('Access-Control-Allow-Headers')).toBe('Content-Type');
        });
    });

    describe('GET method', () => {
        test('should return empty tasks array when db.json does not exist', async () => {
            const req = httpMocks.createRequest({
                method: 'GET'
            });
            const res = httpMocks.createResponse();

            await tasksHandler(req, res);

            expect(res.statusCode).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data.success).toBe(true);
            expect(data.tasks).toEqual([]);
            expect(data.count).toBe(0);
        });

        test('should return existing tasks from db.json', async () => {
            const testTasks = [
                {
                    id: 1,
                    text: 'Test task 1',
                    completed: false,
                    createdAt: '2025-01-01T00:00:00.000Z'
                },
                {
                    id: 2,
                    text: 'Test task 2',
                    completed: true,
                    createdAt: '2025-01-02T00:00:00.000Z'
                }
            ];

            fs.writeFileSync(path.join(process.cwd(), 'db.json'), JSON.stringify({ tasks: testTasks }, null, 2));

            const req = httpMocks.createRequest({
                method: 'GET'
            });
            const res = httpMocks.createResponse();

            await tasksHandler(req, res);

            expect(res.statusCode).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data.success).toBe(true);
            expect(data.tasks).toEqual(testTasks);
            expect(data.count).toBe(2);
        });

        test('should handle corrupted db.json file', async () => {
            fs.writeFileSync(path.join(process.cwd(), 'db.json'), 'invalid json');

            const req = httpMocks.createRequest({
                method: 'GET'
            });
            const res = httpMocks.createResponse();

            await tasksHandler(req, res);

            expect(res.statusCode).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data.success).toBe(true);
            expect(data.tasks).toEqual([]);
            expect(data.count).toBe(0);
        });
    });

    describe('POST method', () => {
        test('should save new tasks to db.json', (done) => {
            const newTasks = [
                {
                    id: 1,
                    text: 'New task',
                    completed: false,
                    createdAt: '2025-01-01T00:00:00.000Z'
                }
            ];

            const req = httpMocks.createRequest({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tasks: newTasks })
            });

            const res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = JSON.parse(res._getData());
                expect(data.success).toBe(true);
                expect(data.message).toBe('Tasks updated successfully');
                expect(data.tasks).toEqual(newTasks);
                expect(data.count).toBe(1);

                const savedData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db.json'), 'utf8'));
                expect(savedData.tasks).toEqual(newTasks);
                done();
            });

            // Simulate data event
            setTimeout(() => {
                req.emit('data', JSON.stringify({ tasks: newTasks }));
                req.emit('end');
            }, 10);

            tasksHandler(req, res);
        });

        test('should auto-generate ids and timestamps for tasks without them', (done) => {
            const incompleteTasks = [
                {
                    text: 'Task without id',
                    completed: false
                }
            ];

            const req = httpMocks.createRequest({
                method: 'POST'
            });
            const res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = JSON.parse(res._getData());
                expect(data.success).toBe(true);
                expect(data.tasks).toHaveLength(1);
                expect(data.tasks[0]).toHaveProperty('id');
                expect(data.tasks[0]).toHaveProperty('createdAt');
                expect(data.tasks[0].text).toBe('Task without id');
                expect(data.tasks[0].completed).toBe(false);
                done();
            });

            setTimeout(() => {
                req.emit('data', JSON.stringify({ tasks: incompleteTasks }));
                req.emit('end');
            }, 10);

            tasksHandler(req, res);
        });

        test('should return error for non-array tasks', (done) => {
            const req = httpMocks.createRequest({
                method: 'POST'
            });
            const res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                const data = JSON.parse(res._getData());
                expect(data.success).toBe(false);
                expect(data.error).toBe('Tasks must be an array');
                done();
            });

            setTimeout(() => {
                req.emit('data', JSON.stringify({ tasks: 'invalid' }));
                req.emit('end');
            }, 10);

            tasksHandler(req, res);
        });

        test('should return error for invalid JSON', (done) => {
            const req = httpMocks.createRequest({
                method: 'POST'
            });
            const res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                const data = JSON.parse(res._getData());
                expect(data.success).toBe(false);
                expect(data.error).toBe('Invalid JSON in request body');
                done();
            });

            setTimeout(() => {
                req.emit('data', 'invalid json');
                req.emit('end');
            }, 10);

            tasksHandler(req, res);
        });

        test('should normalize task data correctly', (done) => {
            const messyTasks = [
                {
                    text: 'Task 1',
                    completed: 'true' // string instead of boolean
                },
                {
                    text: 'Task 2'
                    // missing completed field
                },
                {
                    id: 'custom-id',
                    text: 'Task 3',
                    completed: false,
                    createdAt: '2025-01-01T00:00:00.000Z'
                }
            ];

            const req = httpMocks.createRequest({
                method: 'POST'
            });
            const res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = JSON.parse(res._getData());
                expect(data.success).toBe(true);
                expect(data.tasks).toHaveLength(3);

                expect(data.tasks[0].completed).toBe(true); // normalized to boolean
                expect(data.tasks[1].completed).toBe(false); // default false
                expect(data.tasks[2].id).toBe('custom-id'); // preserved custom id

                data.tasks.forEach(task => {
                    expect(task).toHaveProperty('id');
                    expect(task).toHaveProperty('text');
                    expect(task).toHaveProperty('completed');
                    expect(task).toHaveProperty('createdAt');
                    expect(typeof task.completed).toBe('boolean');
                });

                done();
            });

            setTimeout(() => {
                req.emit('data', JSON.stringify({ tasks: messyTasks }));
                req.emit('end');
            }, 10);

            tasksHandler(req, res);
        });
    });

    describe('Unsupported methods', () => {
        test('should return 405 for PUT method', async () => {
            const req = httpMocks.createRequest({
                method: 'PUT'
            });
            const res = httpMocks.createResponse();

            await tasksHandler(req, res);

            expect(res.statusCode).toBe(405);
            const data = JSON.parse(res._getData());
            expect(data.success).toBe(false);
            expect(data.error).toBe('Method PUT not allowed');
        });

        test('should return 405 for DELETE method', async () => {
            const req = httpMocks.createRequest({
                method: 'DELETE'
            });
            const res = httpMocks.createResponse();

            await tasksHandler(req, res);

            expect(res.statusCode).toBe(405);
            const data = JSON.parse(res._getData());
            expect(data.success).toBe(false);
            expect(data.error).toBe('Method DELETE not allowed');
        });
    });

    describe('CORS headers', () => {
        test('should include CORS headers in all responses', async () => {
            const methods = ['GET', 'POST', 'OPTIONS'];

            for (const method of methods) {
                const req = httpMocks.createRequest({ method });
                const res = httpMocks.createResponse({
                    eventEmitter: require('events').EventEmitter
                });

                if (method === 'POST') {
                    res.on('end', () => {
                        expect(res.getHeader('Access-Control-Allow-Origin')).toBe('*');
                        expect(res.getHeader('Access-Control-Allow-Methods')).toBe('GET, POST, OPTIONS');
                        expect(res.getHeader('Access-Control-Allow-Headers')).toBe('Content-Type');
                    });

                    setTimeout(() => {
                        req.emit('data', '{"tasks":[]}');
                        req.emit('end');
                    }, 10);

                    tasksHandler(req, res);
                } else {
                    await tasksHandler(req, res);
                    expect(res.getHeader('Access-Control-Allow-Origin')).toBe('*');
                    expect(res.getHeader('Access-Control-Allow-Methods')).toBe('GET, POST, OPTIONS');
                    expect(res.getHeader('Access-Control-Allow-Headers')).toBe('Content-Type');
                }
            }
        });
    });
});