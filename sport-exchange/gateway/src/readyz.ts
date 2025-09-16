import type { Request, Response } from 'express';
import { natsConn } from './natsClient';

export async function readyz(_req: Request, res: Response) {
    try {
        const nc = await natsConn();
        if (!nc.isClosed()) return res.status(200).send('ok');
    } catch {}
    res.status(503).send('unready');
}