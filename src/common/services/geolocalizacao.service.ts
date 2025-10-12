import { Injectable } from '@nestjs/common';
import * as geoip from 'geoip-lite';

export interface GeolocalizacaoResult {
  cidade: string;
  estado: string;
}

@Injectable()
export class GeolocalizacaoService {
  obterGeolocalizacao(ip: string): GeolocalizacaoResult {
    // Trata casos de localhost
    if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost' || ip.includes('::ffff:127.0.0.1')) {
      return {
        cidade: 'Localhost',
        estado: 'Localhost',
      };
    }

    // Trata IP desconhecido
    if (!ip || ip === 'IP desconhecido') {
      return {
        cidade: 'Desconhecido',
        estado: 'Desconhecido',
      };
    }

    // Remove prefixo IPv6 para IPv4
    let ipLimpo = ip;
    if (ip.startsWith('::ffff:')) {
      ipLimpo = ip.substring(7);
    }

    // Busca geolocalização
    const geo = geoip.lookup(ipLimpo);

    if (!geo) {
      return {
        cidade: 'Desconhecido',
        estado: 'Desconhecido',
      };
    }

    // geo.city pode vir vazio em alguns casos
    const cidade = geo.city || 'Desconhecido';
    // geo.region é o código do estado (ex: SP, RJ, MG)
    const estado = geo.region || 'Desconhecido';

    return {
      cidade,
      estado,
    };
  }
}

