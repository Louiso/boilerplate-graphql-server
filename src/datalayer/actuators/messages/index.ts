import { SendTemplatedEmailRequest } from 'aws-sdk/clients/ses'
import { ses } from 'config/connections'

interface EmailParams {
  ToAddresses: string[];
  templateName: string;
  templateData: any;
  company: string;
  emailSender: string;
  replyAddresses: string[];
}

interface EmailOpenDesktopParams {
  companyLogo: string;
  destinatario: string;
  company: string;
  job: string;
  jobUrl: string;
  email: string;
  taskName: string;
  subject: string;
}

class MESSAGES {
  generateTemplateData(templateData: any) {
    try {
      return {
        ...templateData,
        unsubscribeLink: `https://unsubscribe.krowdy.com/email?value=${templateData.email}`
      }
    } catch (error) {
      throw error
    }
  }

  generateEmailParams({
    ToAddresses,
    templateName,
    templateData,
    company,
    emailSender,
    replyAddresses
  }: EmailParams
  ): SendTemplatedEmailRequest {
    try {
      return {
        ConfigurationSetName: 'ConfigurationKrowdy',
        Destination         : {
          ToAddresses
        },
        ReplyToAddresses: replyAddresses,
        Source          : `${company} <${emailSender}>`,
        Template        : templateName,
        TemplateData    : JSON.stringify(templateData)
      }
    } catch (error) {
      throw error
    }
  }

  async sendEmail(params: SendTemplatedEmailRequest) {
    try {
      const logMessage = await ses.sendTemplatedEmail(params).promise()

      return {
        MessageId: logMessage.MessageId
      }
    } catch (error) {
      throw error
    }
  }

  async sendEmailOpenTaskInDesktop(parametersTemplateData: EmailOpenDesktopParams) {
    const getParamsTemplate = this.generateTemplateData(parametersTemplateData)
    const getParamsEmail = this.generateEmailParams({
      ToAddresses   : [ parametersTemplateData.email ],
      templateName  : 'ats_candidates_open_desktop_task',
      company       : parametersTemplateData.company,
      emailSender   : 'notificaciones@krowdy.com',
      replyAddresses: [ 'notificaciones@krowdy.com' ],
      templateData  : getParamsTemplate
    })
    const operationSendEmail = await this.sendEmail(getParamsEmail)

    return operationSendEmail
  }
}

const messageController = new MESSAGES()

export {
  messageController
}
