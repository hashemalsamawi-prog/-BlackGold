import logoImg from './images/black_gold_logo_transparent.svg';
import logoRasterImg from './images/black_gold_logo_1786125297515.jpg';
import pouchPairImg from './images/black_gold_pouch_pair_1786125935649.jpg';
import shishaSessionImg from './images/black_gold_shisha_session_1786125947470.jpg';
import retailStandImg from './images/black_gold_retail_stand_1786125959576.jpg';
import deliveryFleetImg from './images/black_gold_delivery_fleet_1786125973582.jpg';
import merchKitImg from './images/black_gold_merch_kit_1786125990648.jpg';
import heroBannerImg from './images/charcoal_hero_banner_1786118670743.jpg';
import localPackImg from './images/local_charcoal_pack_1786118685561.jpg';
import premiumPackImg from './images/premium_charcoal_pack_1786118701517.jpg';

export const ASSETS = {
  logo: logoImg,
  logoRaster: logoRasterImg,
  pouchPair: pouchPairImg,
  shishaSession: shishaSessionImg,
  retailStand: retailStandImg,
  deliveryFleet: deliveryFleetImg,
  merchKit: merchKitImg,
  heroBanner: heroBannerImg,
  localPack: localPackImg,
  premiumPack: premiumPackImg,
};

// Map raw paths to bundled URLs as fallback
const pathMap: Record<string, string> = {
  '/src/assets/images/black_gold_logo_transparent.svg': logoImg,
  '/src/assets/images/black_gold_logo_1786125297515.jpg': logoImg,
  '/src/assets/images/black_gold_pouch_pair_1786125935649.jpg': pouchPairImg,
  '/src/assets/images/black_gold_shisha_session_1786125947470.jpg': shishaSessionImg,
  '/src/assets/images/black_gold_retail_stand_1786125959576.jpg': retailStandImg,
  '/src/assets/images/black_gold_delivery_fleet_1786125973582.jpg': deliveryFleetImg,
  '/src/assets/images/black_gold_merch_kit_1786125990648.jpg': merchKitImg,
  '/src/assets/images/charcoal_hero_banner_1786118670743.jpg': heroBannerImg,
  '/src/assets/images/local_charcoal_pack_1786118685561.jpg': localPackImg,
  '/src/assets/images/premium_charcoal_pack_1786118701517.jpg': premiumPackImg,
};

export const resolveAsset = (path: string): string => {
  if (pathMap[path]) {
    return pathMap[path];
  }
  return path;
};
