import CoordBounds from "./models/coordBounds";
import looksSame from "looks-same";

export type FindDifferentAreasOptions = {
  shouldCluster: boolean;
  clustersSize: number;
};

export default async function findDifferentAreas(
  left: string,
  right: string,
  options: FindDifferentAreasOptions
): Promise<CoordBounds[]> {
  return new Promise<CoordBounds[]>((resolve, reject) =>
    looksSame(left, right, options, (error, result) => {
      if (error) reject(error);
      else {
        resolve(result.equal ? [] : result.diffClusters ?? []);
      }
    })
  );
}
