import { TestBed } from '@angular/core/testing';

import { GuiInfoPanelService } from './gui-info-panel.service';

describe('GuiInfoPanelService', () => {
  let service: GuiInfoPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuiInfoPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
