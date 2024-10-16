// import Navbar from '@/app/ui/dashboard/sidenav';
// import Footer from '@/app/ui/dashboard/footer';
import Header from '@/app/ui/dashboard/app_setting/header';
import '@/app/ui/dashboard/app_setting/app_setting.css';


// export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container">
            {/* Full-height container */}
            <div className="header">
                <Header />
            </div>
            <div className="content">
                <div className="flex-grow p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}