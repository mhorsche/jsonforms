/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { async, TestBed } from '@angular/core/testing';
import { MatCheckboxModule, MatFormFieldModule } from '@angular/material';
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { BooleanControlRenderer } from '../src';

describe('Boolean control', () => {
    let fixture;
    let component;

    const data = { foo: true };
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'boolean'
            }
        }
    };
    const uischema = {
        type: 'Control',
        scope: '#/properties/foo'
    };

    beforeEach(async (() => {
        TestBed.configureTestingModule({
            declarations: [BooleanControlRenderer],
            imports: [
                MatCheckboxModule,
                MatFormFieldModule
            ],
            providers: [
                { provide: NgRedux, useFactory: MockNgRedux.getInstance }
            ]
        }).compileComponents();

        MockNgRedux.reset();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BooleanControlRenderer);
        component = fixture.componentInstance;
    });

    it('should support setting the initial state', async(() => {
        const mockSubStore = MockNgRedux.getSelectorStub();
        component.uischema = uischema;

        mockSubStore.next({
            jsonforms: {
                core: {
                    data,
                    schema,
                }
            }
        });
        mockSubStore.complete();
        component.ngOnInit();
        expect(component.data).toBe(true);
    }));

    it('should support updating the state', async(() => {
        const mockSubStore = MockNgRedux.getSelectorStub();
        component.uischema = uischema;

        mockSubStore.next({
            jsonforms: {
                core: {
                    data,
                    schema,
                }
            }
        });
        mockSubStore.complete();
        component.ngOnInit();
        MockNgRedux.reset();
        const mockSubStore2 = MockNgRedux.getSelectorStub();
        mockSubStore2.next({
            jsonforms: {
                core: {
                    data: { foo: false },
                    schema,
                }
            }
        });
        mockSubStore2.complete();
        fixture.detectChanges();
        expect(component.data).toBe(false);
    }));

    it('should display errors', async(() => {
        const mockSubStore = MockNgRedux.getSelectorStub();
        component.uischema = uischema;

        mockSubStore.next({
            jsonforms: {
                core: {
                    data,
                    schema,
                    errors: [{
                        dataPath: 'foo',
                        message: 'Hi, this is me, test error!'
                    }]
                }
            },
        });
        mockSubStore.complete();
        component.ngOnInit();
        fixture.detectChanges();
        const booleanControl = fixture.nativeElement;
        expect(booleanControl.getElementsByTagName('mat-error').length).toBe(1);
    }));
});