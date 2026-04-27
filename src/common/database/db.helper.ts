/**
 * Database helper functions for geometry operations
 */

export class DbHelper {
  static asGeoJSON(columnName: string): string {
    return `ST_AsGeoJSON(${columnName})`
  }

  static geomFromText(wkt: string, srid: number = 4326): string {
    const escapedWkt = wkt.replace(/'/g, "''");
    return `ST_GeomFromText('${escapedWkt}', ${srid})`
  }

  static point(lng: number, lat: number): string {
    return `ST_Point(${lng}, ${lat})`
  }

  static parseGeoJSON(geoJsonString: string | null): any {
    if (!geoJsonString) return null;
    try {
      return JSON.parse(geoJsonString);
    } catch (e) {
      console.error('Failed to parse GeoJSON:', geoJsonString);
      return null;
    }
  }

  static pointInsideGeometry(
    geometryColumn: string,
    lng: number,
    lat: number,
  ): string {
    return `ST_Contains(${geometryColumn}, ${this.point(lng, lat)})`
  }
}