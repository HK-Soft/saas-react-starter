// scripts/validate-translations.cjs
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/lib/i18n/locales');
const SUPPORTED_LANGS = ['en', 'ar', 'fr'];
const NAMESPACES = ['common', 'auth', 'dashboard', 'errors'];

function flattenObject(obj, prefix = '') {
    let flattened = {};

    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(flattened, flattenObject(obj[key], prefix + key + '.'));
        } else {
            flattened[prefix + key] = obj[key];
        }
    }

    return flattened;
}

function validateTranslations() {
    console.log('🌍 Validating translations...');

    let hasErrors = false;
    const translationData = {};

    // Load all translation files
    for (const lang of SUPPORTED_LANGS) {
        translationData[lang] = {};

        for (const namespace of NAMESPACES) {
            const filePath = path.join(LOCALES_DIR, lang, `${namespace}.json`);

            if (!fs.existsSync(filePath)) {
                console.error(`❌ Missing file: ${filePath}`);
                hasErrors = true;
                continue;
            }

            try {
                const content = fs.readFileSync(filePath, 'utf8');
                translationData[lang][namespace] = JSON.parse(content);
                console.log(`✅ Loaded ${lang}/${namespace}.json`);
            } catch (error) {
                console.error(`❌ Invalid JSON in ${filePath}:`, error.message);
                hasErrors = true;
            }
        }
    }

    // Compare keys between languages
    const baseLanguage = 'en';

    for (const namespace of NAMESPACES) {
        if (!translationData[baseLanguage]?.[namespace]) continue;

        const baseKeys = new Set(Object.keys(flattenObject(translationData[baseLanguage][namespace])));
        console.log(`\n📋 Checking namespace: ${namespace}`);
        console.log(`   Base keys (${baseLanguage}): ${baseKeys.size}`);

        for (const lang of SUPPORTED_LANGS) {
            if (lang === baseLanguage) continue;

            if (!translationData[lang]?.[namespace]) {
                console.error(`❌ Missing namespace ${namespace} for language ${lang}`);
                hasErrors = true;
                continue;
            }

            const langKeys = new Set(Object.keys(flattenObject(translationData[lang][namespace])));
            console.log(`   ${lang} keys: ${langKeys.size}`);

            // Check for missing keys
            const missingKeys = [...baseKeys].filter(key => !langKeys.has(key));
            if (missingKeys.length > 0) {
                console.error(`❌ Missing keys in ${lang}/${namespace}:`);
                missingKeys.forEach(key => console.error(`   - ${key}`));
                hasErrors = true;
            }

            // Check for extra keys
            const extraKeys = [...langKeys].filter(key => !baseKeys.has(key));
            if (extraKeys.length > 0) {
                console.warn(`⚠️ Extra keys in ${lang}/${namespace}:`);
                extraKeys.forEach(key => console.warn(`   + ${key}`));
            }

            if (missingKeys.length === 0 && extraKeys.length === 0) {
                console.log(`✅ ${lang}/${namespace} - Perfect match!`);
            }
        }
    }

    console.log('\n' + '='.repeat(50));

    if (hasErrors) {
        console.error('❌ Translation validation failed!');
        console.error('Please fix the missing translations before continuing.');
        process.exit(1);
    } else {
        console.log('✅ All translations are valid and complete!');
        console.log(`📊 Summary:`);
        console.log(`   Languages: ${SUPPORTED_LANGS.length}`);
        console.log(`   Namespaces: ${NAMESPACES.length}`);
        console.log(`   Total files: ${SUPPORTED_LANGS.length * NAMESPACES.length}`);
    }
}

// Run validation if called directly
if (require.main === module) {
    validateTranslations();
}

module.exports = { validateTranslations };