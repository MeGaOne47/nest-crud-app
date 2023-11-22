/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import * as Excel from 'exceljs';
import { BloodRecipient } from './blood-recipient.entity';
import { BloodRecipientService } from './blood-recipient.service';

@Injectable()
export class BloodRecipientImportService {
  constructor(private readonly bloodRecipientService: BloodRecipientService) {}

  async importFromExcel(fileBuffer: Buffer): Promise<void> {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const worksheet = workbook.getWorksheet(1);

    const data: BloodRecipient[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const bloodRecipient: BloodRecipient = {
            fullName: row.getCell(1).text,
            birthDate: new Date(row.getCell(2).text),
            gender: row.getCell(3).text,
            address: row.getCell(4).text,
            phoneNumber: row.getCell(5).text,
            bloodType: row.getCell(6).text,
            rhFactor: row.getCell(7).text,
            requiredAmount: parseFloat(row.getCell(8).text),
            id: 0,
            connections: [],
            appointments: [],
            urgent: row.getCell(9).text,
        };
        data.push(bloodRecipient);
        console.log("data:", data)
      }
    });

    await this.bloodRecipientService.createMultiple(data);
  }
}
