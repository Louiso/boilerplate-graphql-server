import { SendTemplatedEmailRequest } from 'aws-sdk/clients/ses'
import { ses } from 'config/connections'
import { objectMap } from 'utils/by'
import { Candidate, Job, CandidateTask, TypeCustomMessage } from 'interfaces/graphql'

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

interface EmailInterviewNotificationParams {
  candidateInformation: Candidate;
  typeMessage: string;
  candidateTask: CandidateTask;
  jobInformation: Job;
}

interface TemplateEmailsCategoryTaskParams {
  candidateHelpText: string;
  textButton: string;
  textHeader: string;
  textBody: string;
  withImage: boolean;
  srcImage: string;
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
    try {
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
    } catch (error) {
      throw error
    }
  }

  replaceTokens(stringToReplace: any, valuesToSet: any) {
    if(stringToReplace === true || stringToReplace === false)
      return stringToReplace

    return stringToReplace
      .replace('[candidateFirstName]', valuesToSet.firstName)
      .replace('[jobTitle]', valuesToSet.jobTitle)
      .replace('[dd/mm/aaaa]', valuesToSet.dayDate)
      .replace('[hh/mm]', valuesToSet.hourDate)
      .replace('[mm/ss]', valuesToSet.minutesDate)
  }

  replaceTokensCandidateInMessages(templateEmail: TemplateEmailsCategoryTaskParams, valuesToSet: any) {
    const assignValuesToObject = objectMap(templateEmail, (v: any) => this.replaceTokens(v, valuesToSet))

    return assignValuesToObject
  }

  async sendInterviewNotification(parametersInterviewNotification: EmailInterviewNotificationParams) {
    try {
      const {
        candidateInformation,
        jobInformation,
        candidateTask,
        typeMessage
      } = parametersInterviewNotification

      const [ publication ] = jobInformation.publications!
      const valuesToSet = {
        firstName  : candidateInformation.firstName,
        jobTitle   : publication.title,
        dayDate    : '11/03/2021',
        hourDate   : '04:30',
        minutesDate: '15:00'
      }

      const { templateEmails } = candidateTask.task.categoryTask

      if(!(typeMessage  in TypeCustomMessage))
        return

      const templateEmail = templateEmails![TypeCustomMessage[typeMessage]]
      const testingMessage = this.replaceTokensCandidateInMessages(templateEmail, valuesToSet)
      console.log('spacemacs ~ file: index.ts ~ line 152 ~ MESSAGES ~ sendInterviewNotification ~ testingMessage', testingMessage)

      return
    } catch (error) {
      console.log('spacemacs ~ file: index.ts ~ line 156 ~ MESSAGES ~ sendInterviewNotification ~ error', error)
      throw error
    }
  }
}

const messageController = new MESSAGES()

export {
  messageController
}
