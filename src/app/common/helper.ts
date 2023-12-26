import { environment } from "src/environments/environment";

export class Helper {
  static buildHyperLink(srcCode: string, dstCode: string, doj: string, trainNo: string, cls: string, quota: string): string {
    const link = environment.bookingLink;
    // src=UBL&dst=HLN&doj=20231229&trainNo=17302&cls=1A&q=GN
    const queryParams = `?src=${srcCode}&dst=${dstCode}&doj=${doj}&trainNo=${trainNo}&cls=${cls}&q=${quota}`;
    return link + queryParams;
  }
}
