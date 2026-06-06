import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TemplatesService } from '../templates/templates.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private templatesService: TemplatesService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  // Users management
  @Get('users')
  getUsers(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getUsers(+page, +limit);
  }

  @Put('users/:id/toggle-status')
  toggleUserStatus(@Param('id') id: string) {
    return this.adminService.toggleUserStatus(id);
  }

  // Templates management
  @Get('templates')
  getTemplates(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getTemplates(+page, +limit);
  }

  @Post('templates')
  createTemplate(@Body() body: any) {
    return this.templatesService.create(body);
  }

  @Put('templates/:id')
  updateTemplate(@Param('id') id: string, @Body() body: any) {
    return this.templatesService.update(id, body);
  }

  @Delete('templates/:id')
  deleteTemplate(@Param('id') id: string) {
    return this.templatesService.remove(id);
  }

  // Payments
  @Get('payments')
  getPayments(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getPayments(+page, +limit);
  }

  // Contact messages
  @Get('messages')
  getMessages(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getContactMessages(+page, +limit);
  }

  @Put('messages/:id/read')
  markMessageRead(@Param('id') id: string) {
    return this.adminService.markMessageRead(id);
  }
}
