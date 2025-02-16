import * as exactDomains from 'disposable-email-domains/index.json';

import * as wildcardDomains from 'disposable-email-domains/wildcard.json';

import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockedDomainsService {
  private readonly exactDomainSet: Set<string>;
  private readonly wildcardList: string[];

  constructor() {
    const customExactDomains: string[] = [];

    const customWildcardDomains: string[] = [];

    this.exactDomainSet = new Set([
      ...exactDomains.map((d) => d.toLowerCase()),
      ...customExactDomains.map((d) => d.toLowerCase()),
    ]);

    this.wildcardList = [...wildcardDomains, ...customWildcardDomains].map(
      (d) => d.toLowerCase(),
    );
  }

  public isDomainBlocked(domain: string): boolean {
    const normalizedDomain = domain.toLowerCase();

    if (this.exactDomainSet.has(normalizedDomain)) {
      return true;
    }

    for (const wildcard of this.wildcardList) {
      const trimmed = wildcard.replace(/^\*\./, '');

      if (
        normalizedDomain === trimmed ||
        normalizedDomain.endsWith(`.${trimmed}`)
      ) {
        return true;
      }
    }

    return false;
  }
}
