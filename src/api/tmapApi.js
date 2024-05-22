import axios from "axios";

const tmapApi = {
  async getResultNames(query) {
    let results = [];
    await axios
      .get(
        `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${query}`,
        {
          headers: {
            appKey: import.meta.env.VITE_TMAP_KEY,
          },
        }
      )
      .then((response) => {
        results = response.data.searchPoiInfo.pois.poi.map((poi) => poi.name);
      })
      .catch((error) => {
        // console.log(error);
      });

    return results;
  },
};

export default tmapApi;
