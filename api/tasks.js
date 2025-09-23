const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'db.json');

function ensureDbFile() {
    if (!fs.existsSync(DB_PATH)) {
        const initialData = { tasks: [] };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    }
}

function readTasks() {
    try {
        ensureDbFile();
        const data = fs.readFileSync(DB_PATH, 'utf8');
        const parsed = JSON.parse(data);
        return parsed.tasks || [];
    } catch (error) {
        console.error('Error reading tasks:', error);
        return [];
    }
}

function writeTasks(tasks) {
    try {
        const data = { tasks };
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing tasks:', error);
        return false;
    }
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            const tasks = readTasks();
            res.status(200).json({
                success: true,
                tasks: tasks,
                count: tasks.length
            });
        }
        else if (req.method === 'POST') {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const { tasks } = JSON.parse(body);

                    if (!Array.isArray(tasks)) {
                        res.status(400).json({
                            success: false,
                            error: 'Tasks must be an array'
                        });
                        return;
                    }

                    const validTasks = tasks.map((task, index) => ({
                        id: task.id || Date.now() + index,
                        text: task.text || '',
                        completed: Boolean(task.completed),
                        createdAt: task.createdAt || new Date().toISOString()
                    }));

                    const success = writeTasks(validTasks);

                    if (success) {
                        res.status(200).json({
                            success: true,
                            message: 'Tasks updated successfully',
                            tasks: validTasks,
                            count: validTasks.length
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            error: 'Failed to save tasks'
                        });
                    }
                } catch (parseError) {
                    console.error('Error parsing request body:', parseError);
                    res.status(400).json({
                        success: false,
                        error: 'Invalid JSON in request body'
                    });
                }
            });
        }
        else {
            res.status(405).json({
                success: false,
                error: `Method ${req.method} not allowed`
            });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};