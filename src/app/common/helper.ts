import { environment } from 'src/environments/environment';

export class Helper {
  static buildRedBusHyperLink(
    srcCode: string,
    dstCode: string,
    doj: string,
    trainNo: string,
    cls: string,
    quota: string,
    train: string,
    availableType: string
  ): string {
    const link = environment.redBusBookingLink;
    // src=UBL&dst=HLN&doj=20231229&trainNo=17302&cls=1A&q=GN
    const queryParams = `?src=${srcCode}&dst=${dstCode}&doj=${doj}&trainNo=${trainNo}&cls=${cls}&q=${quota}&train=${train}&avlT=${availableType}`;
    return link + queryParams;
  }

  static buildHdfcSmartBuyHyperLink(
    srcCode: string,
    dstCode: string,
    doj: string,
    trainNo: string,
    cls: string,
    quota: string,
    departureTime: string,
    arrivalTime: string,
    trainName: string
  ): string {
    const link = environment.hdfcSmartBuyLink;
    const searchKey =
      srcCode +
      dstCode +
      convertDateFormat(doj) +
      quota +
      cls +
      trainNo +
      departureTime +
      arrivalTime +
      trainName.toUpperCase();
    return link.replace('{key}', btoa(searchKey));
  }

  static convertTo12HourFormat(time24: string): string {
    if (time24) {
      const [hours, minutes] = time24.split(':');
      const period = Number(hours) >= 12 ? 'PM' : 'AM';
      const hours12 = Number(hours) % 12 || 12;
      return `${hours12}:${minutes} ${period}`;
    }
    return '';
  }

  /**
   * Converts date from dd-mm-yyyy format to yyyymmdd
   * @param {string} date
   * @return {string} convertedDate
   */
  static convertDateToString(date: string): string {
    if (date) {
      const [day, month, year] = date.split('-');
      return year + month + day;
    }
    return '';
  }

  static nextDayDate(date: string): string {
    const [day, month, year] = date.split('-').map(Number);
    const inputDate = new Date(year, month - 1, day);

    const nextDate = new Date(inputDate);
    nextDate.setDate(inputDate.getDate() + 1);

    const nextDateString = [
      nextDate.getDate().toString().padStart(2, '0'),
      (nextDate.getMonth() + 1).toString().padStart(2, '0'),
      nextDate.getFullYear(),
    ].join('-');

    return this.convertDateToString(nextDateString);
  }

  static formatDateString(dateString: string): string {
    if (dateString) {
      const parts = dateString.split('-');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
      const year = parseInt(parts[2], 10);

      const date = new Date(year, month, day);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long', // Full weekday name
        month: 'short', // Abbreviated month name
        day: 'numeric', // Day of the month
      };
      return date.toLocaleDateString('en-US', options);
    }
    return '';
  }
}

function convertDateFormat(inputDate: string) {
  if (inputDate) {
    inputDate = String(inputDate);

    const year = inputDate.substring(0, 4);
    const month = inputDate.substring(4, 6);
    const day = inputDate.substring(6, 8);
    const outputDate = `${day}-${month}-${year}`;
    return outputDate;
  }
  return '';
}
