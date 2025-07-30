// @ts-check
import {defineConfig} from "astro/config";
import starlight from "@astrojs/starlight";
import starlightTypeDoc, {typeDocSidebarGroup} from "starlight-typedoc";
import {createStarlightTypeDocPlugin} from "starlight-typedoc";
const [frontendStarlightTypeDoc, frontendTypeDocSidebarGroup] = createStarlightTypeDocPlugin();
const [backendStarlightTypeDoc, backendTypeDocSidebarGroup] = createStarlightTypeDocPlugin();

export default defineConfig({
  site: "https://home4strays.informatik.tha.de/docs",
  outDir: "public",
  publicDir: "static",
  base: "/docs",
  integrations: [
    starlight({
      title: "Home4Strays",
      logo: {
        src: "./src/assets/logo.svg",
      },
      social: [],
      defaultLocale: "root",
      locales: {
        root: {
          label: "Deutsch",
          lang: "de",
        },
      },
      sidebar: [
        {
          label: "User Dokumentation",
          items: [
            {
              label: "Übersicht",
              link: "/overview/",
            },
            {
              label: "Nicht angemeldete Benutzer",
              items: [
                {label: "Tiere durchsuchen", link: "/roles/guest/browse/"},
                {label: "NGOs durchsuchen", link: "/roles/guest/ngo-search/"},
              ],
            },
            {
              label: "Tierhalter",
              items: [
                {
                  label: "Registrierung & Login",
                  link: "/roles/caretaker/register/",
                },
                {
                  label: "Tiere zur Merkliste hinzufügen",
                  link: "/roles/caretaker/bookmark/",
                },
                {
                  label: "Bearbeitung des Halterprofils",
                  link: "/roles/caretaker/profile/",
                },
                {
                  label: "Vermittlungsprozess",
                  link: "/roles/caretaker/adopt/",
                },
              ],
            },
            {
              label: "NGO-Administratoren",
              items: [
                {
                  label: "Registrierung & Verifizierung",
                  link: "/roles/ngo-admin/register/",
                },
                {
                  label: "NGO-Profil bearbeiten",
                  link: "/roles/ngo-admin/profile/",
                },
              ],
            },
            {
              label: "NGO-Mitglieder",
              items: [
                {
                  label: "Registrierung & Login",
                  link: "/roles/ngo-member/register/",
                },
                {
                  label: "Tiere verwalten",
                  link: "/roles/ngo-member/manage-animals/",
                },
                {
                  label: "Bearbeitung des NGO-Mitgliedprofils",
                  link: "/roles/ngo-member/profile/",
                },
                {label: "Vermittlung", link: "/roles/ngo-member/matching/"},
              ],
            },
            {
              label: "Webseiten-Admin",
              items: [
                {
                  label: "Verifizierung von NGOs",
                  link: "/roles/admin/manage-ngos/",
                },
              ],
            },
          ],
        },
        {
          label: "Admin Dokumentation",
          items: [{label: "Admin Guide", link: "/admin/"}],
        },
        {
          label: "Frontend Code Dokumentation",
          items: [frontendTypeDocSidebarGroup],
        },
        {
          label: "Backend Code Dokumentation",
          items: [backendTypeDocSidebarGroup],
        },
      ],
      plugins: [
        // Backend API documentation
        backendStarlightTypeDoc({
          entryPoints: ["./home4strays-backend/src/**/*.ts"],
          typeDocOptions: {
            exclude: ["./home4strays-backend/src/start.ts", "./home4strays-backend/node_modules/*"],
          },
          tsconfig: "./home4strays-backend/tsconfig.json",
          output: "code/backend",
          sidebar: {
            label: "Backend API",
            collapsed: false,
          },
        }),
        // Frontend documentation
        frontendStarlightTypeDoc({
          entryPoints: ["./home4strays-frontend/app/**/*.tsx", "./home4strays-frontend/contexts/**/*.tsx", "./home4strays-frontend/i18n/**/*.ts"],
          typeDocOptions: {
            exclude: ["./home4strays-frontend/node_modules/*"],
          },
          tsconfig: "./home4strays-frontend/tsconfig.json",
          output: "code/frontend",
          sidebar: {
            label: "Frontend",
            collapsed: false,
          },
        }),
      ],
    }),
  ],
});
