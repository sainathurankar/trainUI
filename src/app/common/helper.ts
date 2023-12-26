import { environment } from "src/environments/environment";

export class Helper {
  static buildRedBusHyperLink(srcCode: string, dstCode: string, doj: string, trainNo: string, cls: string, quota: string): string {
    const link = environment.redBusBookingLink;
    // src=UBL&dst=HLN&doj=20231229&trainNo=17302&cls=1A&q=GN
    const queryParams = `?src=${srcCode}&dst=${dstCode}&doj=${doj}&trainNo=${trainNo}&cls=${cls}&q=${quota}`;
    return link + queryParams;
  }

  static buildHdfcSmartBuyHyperLink(srcCode: string, dstCode: string, doj: string, trainNo: string, cls: string, quota: string, departureTime: string, arrivalTime: string, trainName: string): string {
    const link = environment.hdfcSmartBuyLink;
    const searchKey = srcCode + dstCode + convertDateFormat(doj) + quota + cls + trainNo + departureTime + arrivalTime + trainName.toUpperCase();
    return link.replace('{key}', btoa(searchKey));
  }

}

function convertDateFormat(inputDate: string) {
  inputDate = String(inputDate);

  const year = inputDate.substring(0, 4);
  const month = inputDate.substring(4, 6);
  const day = inputDate.substring(6, 8);
  const outputDate = `${day}-${month}-${year}`;
  return outputDate;
}
