import { AppBaseController } from './app.base.controller';

// @UseGuards(AuthGuard)  //NOTE: In production user will be authenticated by this
export class PrivateBaseController extends AppBaseController {}
