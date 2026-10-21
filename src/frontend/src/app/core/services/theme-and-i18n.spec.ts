import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ThemeService } from './theme.service';
import { I18nService, SUPPORTED_LANGUAGES } from './i18n.service';
import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';

class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

const mockStorage = new LocalStorageMock();
Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
  writable: true
});

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should default to light theme on fresh start', () => {
    expect(service.currentTheme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should switch to dark mode and apply class on document', () => {
    service.setTheme('dark');
    expect(service.currentTheme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(window.localStorage.getItem('vanguard_theme')).toBe('dark');
  });

  it('should toggle theme seamlessly between light and dark', () => {
    service.toggleTheme();
    expect(service.currentTheme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    service.toggleTheme();
    expect(service.currentTheme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({
      providers: [I18nService]
    });
    service = TestBed.inject(I18nService);
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('should default to french and set fr-FR locale', () => {
    expect(service.currentLang()).toBe('fr');
    expect(document.documentElement.getAttribute('lang')).toBe('fr-FR');
  });

  it('should switch to English with en-US locale attribute', () => {
    service.setLanguage('en');
    expect(service.currentLang()).toBe('en');
    expect(document.documentElement.getAttribute('lang')).toBe('en-US');
    expect(window.localStorage.getItem('vanguard_lang')).toBe('en');
  });

  it('should toggle between fr and en', () => {
    service.toggleLanguage();
    expect(service.currentLang()).toBe('en');
    expect(document.documentElement.getAttribute('lang')).toBe('en-US');

    service.toggleLanguage();
    expect(service.currentLang()).toBe('fr');
    expect(document.documentElement.getAttribute('lang')).toBe('fr-FR');
  });

  it('should have US flag and proper metadata for English in SUPPORTED_LANGUAGES', () => {
    const en = SUPPORTED_LANGUAGES.find(l => l.code === 'en');
    expect(en).toBeDefined();
    expect(en?.flag).toBe('🇺🇸');
    expect(en?.locale).toBe('en-US');

    const fr = SUPPORTED_LANGUAGES.find(l => l.code === 'fr');
    expect(fr).toBeDefined();
    expect(fr?.flag).toBe('🇫🇷');
    expect(fr?.locale).toBe('fr-FR');
  });
});

describe('Login & Register Buttons Loading State', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RegisterComponent],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();
  });

  it('Login button should display normal state and transition to loading without jumping', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Se connecter');
    expect(btn.getAttribute('aria-busy')).toBe('false');

    // Simulate loading state
    (fixture.componentInstance as any).loading.set(true);
    fixture.detectChanges();

    expect(btn.textContent).toContain('Connexion en cours…');
    expect(btn.getAttribute('aria-busy')).toBe('true');
    expect(btn.disabled).toBe(true);
    expect(btn.querySelector('.animate-spin')).toBeTruthy();
  });

  it('Register button should display normal state and transition to loading state', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Créer un compte');
    expect(btn.getAttribute('aria-busy')).toBe('false');

    // Simulate loading state
    (fixture.componentInstance as any).loading.set(true);
    fixture.detectChanges();

    expect(btn.textContent).toContain('Création du compte…');
    expect(btn.getAttribute('aria-busy')).toBe('true');
    expect(btn.disabled).toBe(true);
    expect(btn.querySelector('.animate-spin')).toBeTruthy();
  });
});
