import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'positiveNumber' })
export class PositiveNumber implements PipeTransform {
  transform(number: number, args?: any): any {
    return Math.abs(number);
  }
}
