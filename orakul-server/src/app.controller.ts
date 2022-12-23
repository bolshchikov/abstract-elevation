import { Body, Controller, Get, Post } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

@Controller()
export class AppController {
  @Get()
  ping(): string {
    return 'pong';
  }
  @Post('/source-code')
  retrieveSourceCode(@Body() { fileId }: { fileId: string }) {
    const filePath = path.resolve(__dirname, '../', fileId);
    return readFile(filePath, { encoding: 'utf-8' });
  }
}
