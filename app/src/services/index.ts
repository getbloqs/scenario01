import { SportsBettingService } from './sports-betting-service';
import { ConfigService } from "./config-service";

export {
    ConfigService ,
    SportsBettingService
};

export function provideConfigService() : ConfigService {
    return new ConfigService();
};

export function provideSportsBettingService(configService:ConfigService) : SportsBettingService {
    return new SportsBettingService(configService);
}
