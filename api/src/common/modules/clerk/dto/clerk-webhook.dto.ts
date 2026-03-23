import { IsString, IsNotEmpty } from 'class-validator';

export class ClerkWebhookDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  data: {
    id: string;
    first_name?: string;
    last_name?: string;
    email_addresses?: Array<{
      id: string;
      email_address: string;
    }>;
    primary_email_address_id?: string;
  };
}
