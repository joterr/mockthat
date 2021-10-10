import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SHARED_CONSTANTS } from 'src/app/shared/shared-constants';

@Injectable({
    providedIn: 'root'
})
export class UpdateSeoService {

    private readonly baseUrl: string = SHARED_CONSTANTS.BASE_URL;
    private readonly type: string = SHARED_CONSTANTS.SEO.TYPE;
    private readonly imageUrl: string = SHARED_CONSTANTS.BASE_URL + SHARED_CONSTANTS.SEO.IMAGE;
    private readonly baseTitle: string = SHARED_CONSTANTS.SEO.TITLE;
    private readonly initialDescriptions: string = SHARED_CONSTANTS.SEO.DESCRIPTION;
    private readonly staticPageTitle: { [ index: string ]: string; } = SHARED_CONSTANTS.SEO.STATIC_PAGE_TITLE;
    private readonly staticPageDescription: { [ index: string ]: string; } = SHARED_CONSTANTS.SEO.STATIC_PAGE_DESCRIPTION;
    private readonly staticPageKeywords: { [ index: string ]: string; } = SHARED_CONSTANTS.SEO.STATIC_PAGE_KEYWOARDS;

    constructor(
        private meta: Meta,
        private title: Title
    ) { }

    forStaticPage(
        pageUrl: string
    ): void {
        this.updateHTMLTags(
            `${this.staticPageTitle[ pageUrl ]} ___ ${this.baseTitle}`,
            this.type,
            this.imageUrl,
            this.baseUrl + pageUrl,
            this.baseTitle,
            this.staticPageDescription[ pageUrl ],
            this.staticPageKeywords[ pageUrl ]
        );
    }

    private updateHTMLTags(
        title: string,
        type: string,
        imageUrl: string,
        url: string,
        siteName: string,
        description?: string,
        keywords?: string
    ): void {
        this.title.setTitle(title);
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'twitter:title', content: title });
        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ property: 'og:image', content: imageUrl });
        this.meta.updateTag({ property: 'og:site_name', content: siteName });
        this.meta.updateTag({ property: 'og:type', content: type });
        this.meta.updateTag({ property: 'og:description', content: description || this.initialDescriptions });
        this.meta.updateTag({ property: 'twitter:description', content: description || this.initialDescriptions });
        this.meta.updateTag({ name: 'description', content: description || this.initialDescriptions });
        this.meta.updateTag({ name: 'keywords', content: keywords });
    }
}
