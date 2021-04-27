import { getTestBed, TestBed, TestModuleMetadata } from "@angular/core/testing";

export const originalResetTestingModule = TestBed.resetTestingModule;
const preventAngularFromResetting = () => TestBed.resetTestingModule = () => TestBed;
const allowAngularToReset = () => TestBed.resetTestingModule = originalResetTestingModule;

export const setUpTestBed = (moduleDef: TestModuleMetadata) => {
    beforeAll(done => (async () => {
        originalResetTestingModule();
        preventAngularFromResetting();
        getTestBed().configureTestingModule(moduleDef);
        await getTestBed().compileComponents();

        // prevent Angular from resetting testing module
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    // needed for services to be recreated
    afterEach(() => {
        getTestBed()["_activeFixtures"].forEach(fixture => fixture.destroy());
        getTestBed()["_instantiated"] = false;
    });

    afterAll(() => {
        allowAngularToReset();
        TestBed.resetTestingModule();
        clearStylesFromDOM();
    });
};


function clearStylesFromDOM(): void {
    const head: HTMLHeadElement = document.getElementsByTagName("head")[0];
    const styles: HTMLCollectionOf<HTMLStyleElement> = head.getElementsByTagName("style");
    Array.from(styles).forEach(style => style.remove());
}
