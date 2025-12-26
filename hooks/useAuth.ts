
import { useState, useEffect } from 'react';
import { Company, IndustryType } from '../types';

const COMPANIES_STORAGE_KEY = 'registered_companies';
const ACTIVE_COMPANY_ID_KEY = 'active_company_id';

type AuthResult = {
    success: boolean;
    message?: string;
};

const getInitialCompanies = (): Company[] => {
    const defaultCompany: Company = {
        id: '1',
        name: 'ACME Manufacturing',
        email: 'admin@acme.com',
        industryType: 'Manufacturing',
        subscribedServices: [
            'dashboard', 'machines', 'work-orders', 
            'inventory', 'production-planning', 'quality-control',
            'purchase-orders', 'vendors', 'shipments',
            'customers', 'sales-pipeline',
            'invoicing', 'user-roles', 'settings'
        ],
    };

    try {
        const stored = localStorage.getItem(COMPANIES_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    if (!parsed.find((c: Company) => c.id === '1')) {
                        return [defaultCompany, ...parsed];
                    }
                    return parsed;
                }
            } catch (e) {
                console.error("[Auth] JSON parse error for companies", e);
            }
        }
    } catch (error) {
        console.error("[Auth] Failed to read companies from storage", error);
    }
    
    try {
        localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify([defaultCompany]));
    } catch (e) {}
    
    return [defaultCompany];
};


export function useAuth() {
    const [companies, setCompanies] = useState<Company[]>(getInitialCompanies);
    const [activeCompany, setActiveCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("[System] Initializing Auth Service...");
        try {
            const activeId = localStorage.getItem(ACTIVE_COMPANY_ID_KEY);
            if (activeId) {
                const company = companies.find(c => c.id === activeId);
                if (company) {
                    console.log(`[System] Session restored for tenant: ${company.name} (${company.industryType})`);
                    setActiveCompany(company);
                }
            }
        } catch (error) {
            console.error("[System] Failed to load active company", error);
        } finally {
            setLoading(false);
        }
    }, [companies]);

    const updateCompaniesStorage = (updatedCompanies: Company[]) => {
        setCompanies(updatedCompanies);
        try {
            localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(updatedCompanies));
        } catch (e) {}
    };
    
    const login = async (credentials: { email: string, pass: string }): Promise<AuthResult> => {
        console.log(`[Auth] Attempting login for: ${credentials.email}`);
        const company = companies.find(c => c.email.toLowerCase() === credentials.email.toLowerCase());
        
        if (company) {
            console.log(`[Auth] Authentication successful. Mapping to tenant cluster: ${company.id}`);
            setActiveCompany(company);
            try {
                localStorage.setItem(ACTIVE_COMPANY_ID_KEY, company.id);
            } catch (e) {}
            return { success: true };
        }
        
        console.warn(`[Auth] Authentication failed for: ${credentials.email}`);
        return { success: false, message: 'Invalid credentials. Please try again.' };
    };
    
    const signup = async (details: { companyName: string, email: string, pass: string, services: string[], industry: IndustryType }): Promise<AuthResult> => {
        console.log(`[Auth] Initializing new tenant: ${details.companyName} (${details.industry})`);
        const existing = companies.find(c => c.email.toLowerCase() === details.email.toLowerCase());
        
        if (existing) {
            console.warn(`[Auth] Signup failed: Email ${details.email} is already registered.`);
            return { success: false, message: 'An account with this email already exists.' };
        }

        const newCompany: Company = {
            id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: details.companyName,
            email: details.email,
            industryType: details.industry,
            subscribedServices: details.services,
        };

        console.log(`[Auth] Provisioning workspace ${newCompany.id} with ${details.services.length} services.`);
        updateCompaniesStorage([...companies, newCompany]);
        setActiveCompany(newCompany);
        try {
            localStorage.setItem(ACTIVE_COMPANY_ID_KEY, newCompany.id);
        } catch (e) {}

        return { success: true };
    };

    const logout = () => {
        console.log(`[Auth] Terminating session for tenant: ${activeCompany?.name}`);
        setActiveCompany(null);
        try {
            localStorage.removeItem(ACTIVE_COMPANY_ID_KEY);
        } catch (e) {}
    };

    return { activeCompany, loading, login, signup, logout };
}
