import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';

export function catchException(e: Error) {
  if (!e || Object.keys(e).length == 0) {
    throw new HttpException(
      `Internal error: Something went wrong in your API operation`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  if (e instanceof HttpException) {
    throw new HttpException(e.message, e.getStatus());
  }
  if (e instanceof TypeError) {
    throw new BadRequestException(e.message);
  }
  if (e.name === 'CastError') {
    throw new BadRequestException('Invalid ID');
  } else if (e.name === 'ValidationError') {
    throw new BadRequestException(e.message);
  } else if (e.name === 'NotFoundException') {
    throw new NotFoundException(e.message);
  } else if (e.name === 'MongoError' && (e as any).code === 11000) {
    throw new ConflictException('Duplicate key error');
  } else if (e.name === 'DocumentNotFoundError') {
    throw new NotFoundException('Document not found');
  } else if (e.name === 'UnauthorizedException') {
    throw new UnauthorizedException(e.message);
  } else if (e.name === 'ForbiddenException') {
    throw new ForbiddenException(e.message);
  } else if (e.name === 'ConflictException') {
    throw new ConflictException(e.message);
  } else if (e.name === 'RequestTimeoutException') {
    throw new RequestTimeoutException(e.message);
  } else if (e.name === 'InternalServerErrorException') {
    throw new InternalServerErrorException(e.message);
  } else if (e.name === 'TypeError') {
    throw new BadRequestException('Invalid type encountered');
  } else if (e.name === 'SyntaxError') {
    throw new BadRequestException('Syntax error in request');
  } else if (e.name === 'ReferenceError') {
    throw new InternalServerErrorException('Invalid reference in code');
  } else if (e.name === 'RangeError') {
    throw new BadRequestException('Value out of range');
  } else if (e.name === 'BadRequestException') {
    throw new BadRequestException(e.message);
  } else {
    throw new HttpException(
      `Internal error: ${e.message} `,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
