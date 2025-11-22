
import { useState, useEffect } from 'react';
import { Company } from '../types';

const COMPANIES_STORAGE_KEY = 'registered_companies';
const ACTIVE_COMPANY_ID_KEY = 'active_company_id';

type AuthResult = {
    success: boolean;
    message?: string;
};

const getInitialCompanies = (): Company[] => {
    // Add a default company for demonstration purposes
    const defaultCompany: Company = {
        id: '1',
        name: 'ACME Manufacturing',
        email: 'admin@acme.com',
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
            const companies = JSON.parse(stored);
            // Ensure default company exists
            if (!companies.find((c: Company) => c.id === '1')) {
                return [defaultCompany, ...companies];
            }
            return companies;
        }
    } catch (error) {
        console.error("Failed to parse companies from storage", error);
    }
    
    // If nothing in storage or error, set the default company safely
    try {
        localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify([defaultCompany]));
    } catch (e) {
        console.error("Failed to save default company to local storage", e);
    }
    
    return [defaultCompany];
};


export function useAuth() {
    const [companies, setCompanies] = useState<Company[]>(getInitialCompanies);
    const [activeCompany, setActiveCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const activeId = localStorage.getItem(ACTIVE_COMPANY_ID_KEY);
            if (activeId) {
                const company = companies.find(c => c.id === activeId);
                setActiveCompany(company || null);
            }
        } catch (error) {
            console.error("Failed to load active company", error);
        } finally {
            setLoading(false);
        }
    }, [companies]);

    const updateCompaniesStorage = (updatedCompanies: Company[]) => {
        setCompanies(updatedCompanies);
        try {
            localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(updatedCompanies));
        } catch (e) {
            console.error("Failed to update companies storage", e);
        }
    };
    
    const login = async (credentials: { email: string, pass: string }): Promise<AuthResult> => {
        // In a real app, you'd verify the password hash. Here we just check the email.
        const company = companies.find(c => c.email.toLowerCase() === credentials.email.toLowerCase());
        if (company) {
            setActiveCompany(company);
            try {
                localStorage.setItem(ACTIVE_COMPANY_ID_KEY, company.id);
            } catch (e) {
                console.error("Failed to save active company ID", e);
            }
            return { success: true };
        }
        return { success: false, message: 'Invalid credentials. Please try again.' };
    };
    
    const signup = async (details: { companyName: string, email: string, pass: string, services: string[] }): Promise<AuthResult> => {
        const existing = companies.find(c => c.email.toLowerCase() === details.email.toLowerCase());
        if (existing) {
            return { success: false, message: 'An account with this email already exists.' };
        }

        const newCompany: Company = {
            id: new Date().getTime().toString(),
            name: details.companyName,
            email: details.email,
            subscribedServices: details.services,
        };

        updateCompaniesStorage([...companies, newCompany]);
        
        // Automatically log in the new company
        setActiveCompany(newCompany);
        try {
            localStorage.setItem(ACTIVE_COMPANY_ID_KEY, newCompany.id);
        } catch (e) {
            console.error("Failed to save active company ID", e);
        }

        return { success: true };
    };

    const logout = () => {
        setActiveCompany(null);
        try {
            localStorage.removeItem(ACTIVE_COMPANY_ID_KEY);
        } catch (e) {
            console.error("Failed to remove active company ID", e);
        }
    };

    return { activeCompany, loading, login, signup, logout };
}
