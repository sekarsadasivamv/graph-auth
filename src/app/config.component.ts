import { ConfigService } from './config.service';

export interface Config {
    Url: string;
  }

export class ConfigComponent {
      
    constructor(
        private configService: ConfigService) {
      }
    
    showConfig() {

    //this.configService.getConfig()
    //  .subscribe((data: Config) => this.config = {
     //     Url: data.Url
     // });
    }
}
