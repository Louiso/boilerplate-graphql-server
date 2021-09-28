import { SendTemplatedEmailRequest } from 'aws-sdk/clients/ses'
import { ses } from 'config/connections'
import { mappingObjects } from 'utils/by'
import { Job, CandidateTask, TypeCustomMessage } from 'interfaces/graphql'
import { Maybe } from 'graphql/jsutils/Maybe'

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
  typeMessage: string;
  candidateTask: CandidateTask;
  jobInformation: Job;
  slug?: Maybe<string>;
  executeDate?: Maybe<string>;
  executeHour?: Maybe<string>;
  executeMinutes?: Maybe<string>;
  executeUrl?: Maybe<string>;
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
    const assignValuesToObject = mappingObjects(templateEmail, (v: any) => this.replaceTokens(v, valuesToSet))

    return assignValuesToObject
  }

  async sendInterviewNotification(parametersInterviewNotification: EmailInterviewNotificationParams) {
    try {
      const {
        jobInformation,
        candidateTask,
        typeMessage,
        slug,
        executeDate,
        executeHour,
        executeMinutes,
        executeUrl
      } = parametersInterviewNotification

      const { templateEmails } = candidateTask.task.categoryTask
      const { candidateInfo } = candidateTask

      const [ publication ] = jobInformation.publications!
      const valuesToSet = {
        firstName  : candidateInfo?.fullName ?? `${candidateInfo?.firstName} ${candidateInfo?.lastName}`,
        jobTitle   : publication.title,
        dayDate    : executeDate,
        hourDate   : executeHour,
        minutesDate: executeMinutes
      }

      if(!(typeMessage  in TypeCustomMessage))
        return

      const templateEmail = templateEmails![TypeCustomMessage[typeMessage]]
      const messageParams = this.replaceTokensCandidateInMessages(templateEmail, valuesToSet)

      const defaultExecuteURL = `${process.env.APP_URL}/scheduled/${candidateTask.jobId}/task/${candidateTask.taskId}/publication/0${slug ? `?slug=${slug}` : ''}`

      const parametersTemplateData = {
        confidentialCompany: publication?.confidentialCompany,
        companyLogo        : jobInformation.companyPublished?.profile?.logo,
        job                : publication.title,
        company            : jobInformation.companyPublished?.name,
        location           : jobInformation.companyPublished?.profile?.location || '',
        candidateHelpText  : messageParams.candidateHelpText,
        textHeader         : messageParams.textHeader,
        withImage          : messageParams.withImage,
        textBody           : messageParams.textBody,
        srcImage           : messageParams.srcImage,
        executeUrl         : executeUrl || defaultExecuteURL,
        textButton         : messageParams.textButton,
        primaryColor       : jobInformation.companyPublished?.theme?.palette?.primary?.main ?? '#1890FF',
        secondaryColor     : jobInformation.companyPublished?.theme?.palette?.secondary?.main ?? '',
        customColor        : jobInformation.companyPublished?.theme?.palette?.custom?.main ?? '',
        krowdyColor        : jobInformation.companyPublished?.theme?.palette?.krowdy?.main ?? '',
        jobUrl             : `${process.env.APP_URL}/job/${jobInformation._id}/publication/${0}${slug ? `?slug=${slug}` : ''}`,
        subject            : messageParams.subject,
        companyPremium     : jobInformation.companyPublished?.premium ?? false
      }
      console.log('spacemacs ~ file: index.ts ~ line 178 ~ MESSAGES ~ sendInterviewNotification ~ parametersTemplateData', parametersTemplateData)

      const getParamsTemplate = this.generateTemplateData(parametersTemplateData)

      let company = jobInformation?.companyPublished?.name
      if(publication?.confidentialCompany)
        company = 'Team Krowdy'

      const getParamsEmail = this.generateEmailParams({
        ToAddresses   : [ `${candidateInfo?.email}` ],
        templateName  : 'ats_candidates_interviews_notify',
        company       : company!,
        emailSender   : 'notificaciones@krowdy.com',
        replyAddresses: [ 'notificaciones@krowdy.com' ],
        templateData  : getParamsTemplate
      })

      const operationSendEmail = await this.sendEmail(getParamsEmail)

      return operationSendEmail
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
