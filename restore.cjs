const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const filesToRestore = [
    { gitPath: 'frontend/src/pages/Login.jsx', dest: 'src/components/login/Login.jsx', css: 'frontend/src/pages/Login.css', cssDest: 'src/components/login/Login.css' },
    { gitPath: 'frontend/src/pages/MessDashboard.jsx', dest: 'src/components/mess/Tabs/DashboardTab.jsx', css: 'frontend/src/pages/MessDashboard.css', cssDest: 'src/components/mess/Tabs/MessDashboard.css' },
    { gitPath: 'frontend/src/pages/UserDashboard.jsx', dest: 'src/components/user/Tabs/UserDashboardTab.jsx', css: 'frontend/src/pages/UserDashboard.css', cssDest: 'src/components/user/Tabs/UserDashboard.css' },
    { gitPath: 'frontend/src/pages/BillingPOS.jsx', dest: 'src/components/billing/Tabs/BillingPOS.jsx', css: 'frontend/src/pages/BillingPOS.css', cssDest: 'src/components/billing/Tabs/BillingPOS.css' }
];

filesToRestore.forEach(file => {
    const destDir = path.dirname(path.join(__dirname, file.dest));
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    let jsxContent = '';
    let cssContent = '';
    try {
        jsxContent = execSync(`git show HEAD:${file.gitPath}`, { encoding: 'utf-8' });
        cssContent = execSync(`git show HEAD:${file.css}`, { encoding: 'utf-8' });
    } catch (e) {
        console.error(`Failed to get from git: ${file.gitPath}`);
        return;
    }

    // Fix imports
    if (file.dest.includes('Tabs')) {
        jsxContent = jsxContent.replace(/from ['"]\.\.\/api\//g, "from '../../../api/");
        jsxContent = jsxContent.replace(/from ['"]\.\.\/components\//g, "from '../../");
        jsxContent = jsxContent.replace(/import ['"]\.\.\/components\//g, "import '../../");
    } else {
        jsxContent = jsxContent.replace(/from ['"]\.\.\/api\//g, "from '../../api/");
        jsxContent = jsxContent.replace(/from ['"]\.\.\/components\//g, "from '../");
        jsxContent = jsxContent.replace(/import ['"]\.\.\/components\//g, "import '../");
    }

    // Replace old CSS filename with new CSS filename in JSX
    const oldCssName = path.basename(file.css);
    const newCssName = path.basename(file.cssDest);
    jsxContent = jsxContent.replace(`'./${oldCssName}'`, `'./${newCssName}'`);
    jsxContent = jsxContent.replace(`"./${oldCssName}"`, `"./${newCssName}"`);

    fs.writeFileSync(path.join(__dirname, file.dest), jsxContent);
    fs.writeFileSync(path.join(__dirname, file.cssDest), cssContent);
    console.log(`Restored and fixed: ${file.dest}`);
});
