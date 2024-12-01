import { EmailTypeEnum } from '../enums/email-type.enum';

export const emailConstants = {
  [EmailTypeEnum.NOT_ACTIVE_AD]: {
    subject: 'This ad is not active',
    templateName: 'not-active-ad',
  },
};
