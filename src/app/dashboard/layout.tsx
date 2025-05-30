// import Navbar from '@/app/ui/dashboard/sidenav';
import Footer from '@/app/ui/dashboard/footer';
import Header from '@/app/ui/dashboard/header';
// import '@/app/ui/dashboard/dashboard.css';
import LogoutButton from '../components/LogoutButton';
import '@/app/ui/dashboard/dashboard_css.css';

// export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
    return (

            <div className="container">
                <div className="header">
                    <Header />        
                    {/* <LogoutButton /> */}
                </div>
                
                <div className="content">
                <div className="flex-grow overflow-y-auto" style={{ padding: '35px' }}>{children}</div>
                </div>
                <div className="footer">
                    <Footer />
                </div>
            </div>

    );
}


// // export const experimental_ppr = true;

// export default function Layout({ children }: { children: React.ReactNode }) {
//     return (
//         <ProtectedRoute>
//             <div className="container">
//                 {/* Full-height container */}
//                 <div className="header">
//                     <Header />        

//                 </div>
//                 <LogoutButton />
//                 <div className="content">
//                     <div className="flex-grow p-6 overflow-y-auto">{children}</div>
//                 </div>
//                 <div className="footer">
//                     <Footer />
//                 </div>
//             </div>
//         </ProtectedRoute>

//     );
// }