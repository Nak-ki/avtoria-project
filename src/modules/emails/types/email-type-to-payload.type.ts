import { EmailTypeEnum } from '../enums/email-type.enum';
import { EmailPayloadCombined } from './email-payload-combined.type';
import { PickRequired } from './pick-required.type';

export type EmailTypeToPayload = {
  [EmailTypeEnum.NOT_ACTIVE_AD]: PickRequired<EmailPayloadCombined, 'carId'>;
};
