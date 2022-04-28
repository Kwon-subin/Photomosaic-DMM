import { Module ,NestModule, MiddlewareConsumer} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { login } from '../middleware/token';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { Review } from 'src/entities/review';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewLike } from 'src/entities/review_like';
import { RequestMethod } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

@Module({
    imports:[
        TypeOrmModule.forFeature([Review,ReviewLike]), 
        JwtModule.register({
            secret: jwtConstants.accesssecret,
            //signOptions: { expiresIn: '7200s' },
        }),
        UserModule
    ],
    providers:[ReviewService],
    exports:[ReviewService]
})

export class ReviewModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(login).exclude(
        { path: 'review/byStoreId/:store_id', method: RequestMethod.GET })
        .forRoutes(ReviewController);
    }
}
