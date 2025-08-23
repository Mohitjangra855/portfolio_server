import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiOperation } from '@nestjs/swagger';


@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiOperation({ summary: 'Send a contact form email' })
  @Post()
  create(@Body() { name, email, subject, message }: { name: string; email: string; subject: string; message: string }) {
    return this.contactService.sendEmail(name, email, subject, message);
  }

}
