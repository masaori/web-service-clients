import fs from 'fs'
import path from 'path'
import { google, sheets_v4, drive_v3, forms_v1 } from 'googleapis'

export class GoogleApiClient {
  constructor(public readonly googleServiceAccountJsonPath: string) {
    if (!fs.existsSync(this.googleServiceAccountJsonPath)) {
      throw new Error(`google service account json is not found: ${this.googleServiceAccountJsonPath}`)
    }
  }

  private sheetsApi: sheets_v4.Sheets | null = null

  private driveApi: drive_v3.Drive | null = null

  private formsApi: forms_v1.Forms | null = null

  private async authorize() {
    if (this.sheetsApi || this.driveApi) {
      return
    }

    const serviceAccountCredentialJson = fs.readFileSync(path.resolve(this.googleServiceAccountJsonPath), 'utf-8')
    const serviceAccountCredentials: unknown = JSON.parse(serviceAccountCredentialJson)

    if (
      !serviceAccountCredentials ||
      typeof serviceAccountCredentials !== 'object' ||
      !('client_email' in serviceAccountCredentials) ||
      !serviceAccountCredentials.client_email ||
      typeof serviceAccountCredentials.client_email !== 'string' ||
      !('private_key' in serviceAccountCredentials) ||
      !serviceAccountCredentials.private_key ||
      typeof serviceAccountCredentials.private_key !== 'string'
    ) {
      throw new Error('client_email or private_key is not found')
    }

    const jwtClient = new google.auth.JWT(
      serviceAccountCredentials.client_email,
      undefined,
      serviceAccountCredentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
      undefined,
    )

    await jwtClient.authorize()
    this.sheetsApi = google.sheets({ version: 'v4', auth: jwtClient })
    this.driveApi = google.drive({ version: 'v3', auth: jwtClient })
    this.formsApi = google.forms({ version: 'v1', auth: jwtClient })
  }

  async getSheetContent(spreadsheetId: string, sheetTitle: string, range: string): Promise<(string | number)[][]> {
    await this.authorize()

    if (!this.sheetsApi) {
      throw new Error('sheets is not initialized')
    }

    const response = await this.sheetsApi.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTitle}!${range}`,
    })

    if (!response.data.values) {
      throw new Error('values is not found')
    }

    return response.data.values
  }

  async updateSheetContent(spreadsheetId: string, sheetTitle: string, range: string, values: (string | number)[][]): Promise<(string | number)[][]> {
    await this.authorize()

    if (!this.sheetsApi) {
      throw new Error('sheets is not initialized')
    }

    await this.sheetsApi.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetTitle}!${range}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    })

    return values
  }

  async getSpreadsheet(spreadsheetId: string): Promise<{
    spreadsheetId: string
    spreadsheetUrl: string
    title: string
  }> {
    await this.authorize()

    if (!this.sheetsApi) {
      throw new Error('sheets is not initialized')
    }

    const response = await this.sheetsApi.spreadsheets.get({
      spreadsheetId,
      fields: 'spreadsheetId,spreadsheetUrl,properties.title',
    })

    if (!response.data.spreadsheetId || !response.data.spreadsheetUrl) {
      throw new Error('spreadsheetId or spreadsheetUrl is not found')
    }

    if (!response.data.properties?.title) {
      throw new Error('title is not found')
    }

    return {
      spreadsheetId: response.data.spreadsheetId,
      spreadsheetUrl: response.data.spreadsheetUrl,
      title: response.data.properties.title,
    }
  }

  async getAllSpreadsheets(): Promise<
    {
      spreadsheetId: string
      spreadsheetUrl: string
      title: string
    }[]
  > {
    await this.authorize()

    if (!this.sheetsApi) {
      throw new Error('sheets is not initialized')
    }

    const response = await this.sheetsApi.spreadsheets.get({
      fields: 'spreadsheetId,spreadsheetUrl,sheets.properties.title',
    })

    if (!response.data.sheets) {
      throw new Error('sheets is not found')
    }

    return response.data.sheets.map((sheet) => {
      if (!response.data.spreadsheetId || !response.data.spreadsheetUrl) {
        throw new Error('spreadsheetId or spreadsheetUrl is not found')
      }

      if (!sheet.properties?.title) {
        throw new Error('title is not found')
      }

      return {
        spreadsheetId: response.data.spreadsheetId,
        spreadsheetUrl: response.data.spreadsheetUrl,
        title: sheet.properties.title,
      }
    })
  }

  async createSpreadsheet(title: string): Promise<{
    spreadsheetId: string
    spreadsheetUrl: string
  }> {
    await this.authorize()

    if (!this.sheetsApi || !this.driveApi) {
      throw new Error('sheets or drive is not initialized')
    }

    const response = await this.sheetsApi.spreadsheets.create({
      requestBody: {
        properties: {
          title,
        },
      },
      fields: 'spreadsheetId,spreadsheetUrl',
    })

    if (!response.data.spreadsheetId || !response.data.spreadsheetUrl) {
      throw new Error('spreadsheetId or spreadsheetUrl is not found')
    }

    // Set permission to anyone
    await this.driveApi.permissions.create({
      fileId: response.data.spreadsheetId,
      requestBody: {
        role: 'writer',
        type: 'anyone',
      },
    })

    return {
      spreadsheetId: response.data.spreadsheetId,
      spreadsheetUrl: response.data.spreadsheetUrl,
    }
  }

  async updateSpreadsheet(
    spreadsheetId: string,
    title: string,
  ): Promise<{
    spreadsheetId: string
    spreadsheetUrl: string
  }> {
    await this.authorize()

    if (!this.sheetsApi) {
      throw new Error('sheets is not initialized')
    }

    const response = await this.sheetsApi.spreadsheets.get({
      spreadsheetId,
      fields: 'spreadsheetId,spreadsheetUrl',
    })

    if (!response.data.spreadsheetId || !response.data.spreadsheetUrl) {
      throw new Error('spreadsheetId or spreadsheetUrl is not found')
    }

    await this.sheetsApi.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateSpreadsheetProperties: {
              properties: {
                title,
              },
              fields: 'title',
            },
          },
        ],
      },
    })

    return {
      spreadsheetId: response.data.spreadsheetId,
      spreadsheetUrl: response.data.spreadsheetUrl,
    }
  }

  async createSheet(
    spreadsheetId: string,
    title: string,
    values: (string | number)[][],
  ): Promise<{
    spreadsheetId: string
    sheetId: number
    spreadsheetUrl: string
  }> {
    await this.authorize()

    if (!this.sheetsApi) {
      throw new Error('sheets is not initialized')
    }

    // Get spreadsheet info
    const spreadsheet = await this.sheetsApi.spreadsheets.get({
      spreadsheetId,
      fields: 'sheets(properties(sheetId,title))',
    })

    if (!spreadsheet.data.sheets) {
      throw new Error('sheets is not found')
    }

    // Remove default sheet
    const isDefault = spreadsheet.data.sheets.length === 1 && spreadsheet.data.sheets[0].properties?.title === 'Sheet1'

    let sheetId: number

    if (isDefault) {
      sheetId = spreadsheet.data.sheets[0].properties?.sheetId || 0
    } else {
      // Create new sheet
      const sheet = await this.sheetsApi.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title,
                },
              },
            },
          ],
        },
      })

      sheetId = sheet.data.replies?.[0]?.addSheet?.properties?.sheetId || 0
    }

    if (sheetId === undefined || sheetId === null) {
      throw new Error('sheetId is not found')
    }

    // Update sheet title
    await this.sheetsApi.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId,
                title,
              },
              fields: 'title',
            },
          },
        ],
      },
    })

    await this.sheetsApi.spreadsheets.values.append({
      spreadsheetId,
      range: `${title}!A1:Z1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    })

    return {
      spreadsheetId,
      sheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheetId}`,
    }
  }

  async updateSheet(
    spreadsheetId: string,
    sheetId: number,
    title: string,
    values: (string | number)[][],
  ): Promise<{
    spreadsheetId: string
    sheetId: number
    spreadsheetUrl: string
  }> {
    await this.authorize()

    if (!this.sheetsApi) {
      throw new Error('sheets is not initialized')
    }

    // Update sheet title
    await this.sheetsApi.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId,
                title,
              },
              fields: 'title',
            },
          },
        ],
      },
    })

    await this.sheetsApi.spreadsheets.values.update({
      spreadsheetId,
      range: `${title}!A1:Z1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    })

    return {
      spreadsheetId,
      sheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheetId}`,
    }
  }

  async deleteSheet(spreadsheetId: string, sheetTitle: string): Promise<void> {
    await this.authorize()

    if (!this.sheetsApi) {
      throw new Error('sheets is not initialized')
    }

    // Get spreadsheet info
    const spreadsheet = await this.sheetsApi.spreadsheets.get({
      spreadsheetId,
      fields: 'sheets(properties(sheetId,title))',
    })

    if (!spreadsheet.data.sheets) {
      throw new Error('sheets is not found')
    }

    const sheet = spreadsheet.data.sheets.find((sheet) => sheet.properties?.title === sheetTitle)

    if (!sheet) {
      throw new Error('sheet is not found')
    }

    await this.sheetsApi.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteSheet: {
              sheetId: sheet.properties?.sheetId,
            },
          },
        ],
      },
    })
  }

  async createForm(title: string, documentTitle: string): Promise<{
    formId: string
    formUrl: string
    linkedSheetId: string
    responderUri: string
  }> {
    await this.authorize()

    if (!this.formsApi) {
      throw new Error('forms is not initialized')
    }

    const response = await this.formsApi.forms.create({
      requestBody: {
        info: {
          title,
          documentTitle,
        },
      },
      fields: 'formId,linkedSheetId,responderUri',
    })

    if (!response.data.formId) {
      throw new Error('formId is not found')
    }

    // if (!response.data.linkedSheetId) {
    //   throw new Error('linkedSheetId is not found')
    // }

    if (!response.data.responderUri) {
      throw new Error('responderUri is not found')
    }

    return {
      formId: response.data.formId,
      formUrl: `https://docs.google.com/forms/d/${response.data.formId}/edit`,
      linkedSheetId: response.data.linkedSheetId ?? '',
      responderUri: response.data.responderUri,
    }
  }

  async updateFormInfo(formId: string, info: forms_v1.Schema$Info): Promise<forms_v1.Schema$BatchUpdateFormResponse> {
    await this.authorize()

    if (!this.formsApi) {
      throw new Error('forms is not initialized')
    }

    const response = await this.formsApi.forms.batchUpdate({
      formId,
      requestBody: {
        requests: [
          {
            updateFormInfo: {
              info,
              updateMask: '*',
            },
          },
        ],
      },
    })

    return response.data
  }

  async createItemsToForm(formId: string, items: forms_v1.Schema$Item[]): Promise<forms_v1.Schema$BatchUpdateFormResponse> {
    await this.authorize()

    if (!this.formsApi) {
      throw new Error('forms is not initialized')
    }

    const response = await this.formsApi.forms.batchUpdate({
      formId,
      requestBody: {
        requests: items.map((item, i) => ({
          createItem: {
            item,
            location: {
              index: i,
            },
          },
        })),
      },
    })

    return response.data
  }

  async moveDriveFileToDriveFolder(fileId: string, folderId: string): Promise<void> {
    await this.authorize()

    if (!this.driveApi) {
      throw new Error('drive is not initialized')
    }

    await this.driveApi.files.update({
      fileId,
      addParents: folderId,
      removeParents: 'root',
    })
  }
}
