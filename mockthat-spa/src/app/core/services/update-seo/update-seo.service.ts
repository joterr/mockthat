import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SHARED_CONSTANTS } from 'src/app/shared/shared-constants';

@Injectable({
    providedIn: 'root'
})
export class UpdateSeoService {

    private readonly baseUrl: string = SHARED_CONSTANTS.BASE_URL;
    private readonly baseTitle: string = SHARED_CONSTANTS.SEO.TITLE;
    private readonly initialDescriptions: string = SHARED_CONSTANTS.SEO.DESCRIPTION;
    private readonly initialKeywords: string = SHARED_CONSTANTS.SEO.KEYWORDS;
    private readonly staticPageTitle: { [ index: string ]: string; } = SHARED_CONSTANTS.SEO.STATIC_PAGE_TITLE;
    private readonly staticPageDescription: { [ index: string ]: string; } = SHARED_CONSTANTS.SEO.STATIC_PAGE_DESCRIPTION;

    constructor(
        private meta: Meta,
        private title: Title
    ) { }

    forStaticPage(
        pageUrl: string
    ): void {
        this.updateHTMLTags(
            `${this.staticPageTitle[ pageUrl ]} ___ ${this.baseTitle}`,
            this.baseUrl + pageUrl,
            this.staticPageDescription[ pageUrl ]
        );
    }

    private updateHTMLTags(title: string, url: string, description?: string, keywords?: string): void {
        this.title.setTitle(title);
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'twitter:title', content: title });
        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ property: 'og:site_name', content: title });
        this.meta.updateTag({ property: 'og:type', content: 'article' });
        this.meta.updateTag({ property: 'og:description', content: description || this.initialDescriptions });
        this.meta.updateTag({ property: 'twitter:description', content: description || this.initialDescriptions });
        this.meta.updateTag({ name: 'description', content: description || this.initialDescriptions });
        this.meta.updateTag({ name: 'keywords', content: keywords || this.initialKeywords });
    }
}
