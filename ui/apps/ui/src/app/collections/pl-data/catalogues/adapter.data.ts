import { cataloguesAdapter } from '../../data/catalogues/adapter.data';
import { ICatalogue } from '../../data/catalogues/catalogue.model';
import { ConfigService } from '../../../services/config.service';

export const plCataloguesAdapter = {
  ...cataloguesAdapter,
  adapter: (catalogue: Partial<ICatalogue> & { id: string }) => {
    const result = cataloguesAdapter.adapter(catalogue);
    return {
      ...result,
      redirectUrl: catalogue.pid
        ? `${
            ConfigService.config?.pl_marketplace_url
          }/catalogues/${encodeURIComponent(catalogue.pid)}`
        : '',
      logoUrl: catalogue.pid
        ? `${
            ConfigService.config?.pl_marketplace_url
          }/catalogues/${encodeURIComponent(catalogue.pid)}/logo`
        : '',
    };
  },
};
