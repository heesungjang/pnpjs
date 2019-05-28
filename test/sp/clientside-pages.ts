import { expect } from "chai";
import { testSettings } from "../main";
import { getRandomString, combine } from "@pnp/common";
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/clientside-pages";
import "@pnp/sp/src/files";
import { ClientSidePageFromFile, ClientSideText, ClientSideWebpartPropertyTypes, CreateClientSidePage, ClientSideWebpart, IClientSidePage } from "@pnp/sp/src/clientside-pages";
import { Web } from "@pnp/sp/src/webs";

describe("Clientside Pages", () => {

    if (testSettings.enableWebTests) {

        it("web.addClientSidePage", function () {

            return expect(Web(testSettings.sp.webUrl).addClientSidePage(`TestingAdd_${getRandomString(4)}.aspx`)).to.eventually.be.fulfilled;
        });

        it("CreateClientSidePage", function () {

            return expect(CreateClientSidePage(Web(testSettings.sp.webUrl), `TestingAdd_${getRandomString(4)}.aspx`, "title")).to.eventually.be.fulfilled;
        });

        it("CreateClientSidePage - SingleWebPartAppPage", function () {

            const promise = CreateClientSidePage(Web(testSettings.sp.webUrl), `TestingAdd_${getRandomString(4)}.aspx`, "SingleWebPartAppPage", "SingleWebPartAppPage");
            return expect(promise).to.eventually.be.fulfilled;
        });

        it(".load", async function () {

            const pageFileName = `TestingLoad_${getRandomString(4)}.aspx`;

            await Web(testSettings.sp.webUrl).addClientSidePage(pageFileName);

            // need to make the path relative
            const rel = testSettings.sp.webUrl.substr(testSettings.sp.webUrl.indexOf("/sites/"));
            const promise = ClientSidePageFromFile(sp.web.getFileByServerRelativeUrl(combine("/", rel, "SitePages", pageFileName)));
            return expect(promise).to.eventually.be.fulfilled;
        });

        describe("save", function () {

            it("Should update a pages content with a text control", () => {
                return Web(testSettings.sp.webUrl).addClientSidePage(`TestingSave_${getRandomString(4)}.aspx`).then(page => {

                    page.addSection().addControl(new ClientSideText("This is test text!!!"));

                    return expect(page.save()).to.eventually.be.fulfilled;
                });
            });

            it("Should update a pages content with an embed control", () => {
                return Web(testSettings.sp.webUrl).getClientSideWebParts().then(parts => {

                    Web(testSettings.sp.webUrl).addClientSidePage(`TestingSave_${getRandomString(4)}.aspx`).then(page => {

                        const part = ClientSideWebpart.fromComponentDef(parts.filter(c => c.Id === "490d7c76-1824-45b2-9de3-676421c997fa")[0]);

                        part.setProperties<ClientSideWebpartPropertyTypes.Embed>({
                            embedCode: "https://www.youtube.com/watch?v=IWQFZ7Lx-rg",
                        });

                        page.addSection().addControl(part);

                        return expect(page.save()).to.eventually.be.fulfilled;
                    });
                });
            });
        });

        describe("Page comments", function () {

            let page: IClientSidePage;

            before(async function () {
                this.timeout(0);
                page = await Web(testSettings.sp.webUrl).addClientSidePage(`TestingCommentToggle_${getRandomString(4)}.aspx`);
            });

            it("Should disable", function () {
                return expect(page.disableComments()).to.eventually.be.fulfilled;
            });

            it("Should enable", function () {
                return expect(page.enableComments()).to.eventually.be.fulfilled;
            });
        });

        describe("Sections and Columns", function () {

            let page: IClientSidePage;

            beforeEach(function (done) {
                this.timeout(0);
                Web(testSettings.sp.webUrl).addClientSidePage(`TestingSectionsAndColumns_${getRandomString(4)}.aspx`).then(p => {
                    page = <IClientSidePage>p;
                    done();
                });
            });

            it("Default section, 2 empty columns", async function () {

                if (page.sections.length < 1) {
                    page.addSection();
                }

                page.sections[0].addColumn(6);
                page.sections[0].addColumn(6);

                // save
                await page.save();

                // reload
                await page.load();

                expect(page.sections.length === 1);
                expect(page.sections[0].columns.length === 2);
                expect(page.sections[0].columns[0].factor === 6);
                expect(page.sections[0].columns[1].factor === 6);
            });
        });
    }
});