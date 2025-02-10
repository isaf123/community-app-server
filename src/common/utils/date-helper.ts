export class isoDate {
  getIsoStart(start: string): string {
    const startDate = start ? new Date(start) : new Date();
    return startDate.toISOString().split('T')[0];
  }

  getIsoEnd(end: string | undefined): string | undefined {
    if (!end) return undefined;
    const endDate = new Date(end);
    return endDate?.toISOString().split('T')[0];
  }
}
