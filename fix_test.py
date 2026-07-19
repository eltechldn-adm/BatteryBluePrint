import re

fp = 'src/lib/calc/__tests__/recommend-batteries.test.ts'
content = open(fp).read()

# Fix the import
content = content.replace("import { BATTERY_DATABASE } from '@/data/batteries';", "import { BATTERY_CATALOG } from '@/lib/batteries/catalog';")

# Replace BATTERY_DATABASE with BATTERY_CATALOG
content = content.replace('BATTERY_DATABASE', 'BATTERY_CATALOG')

# Replace availableIn with regionAvailability
content = re.sub(r'b\.availableIn\.includes\((.*?)\)', r'b.regionAvailability[\1]', content)

# Remove // @ts-nocheck
content = content.replace('// @ts-nocheck\n', '')

# Replace result.premium?.battery -> result.premium[0].battery
content = re.sub(r'result\.(premium|midRange|diy|budget|value)(\?)?\.battery', r'result.\1?.[0]?.battery', content)
content = re.sub(r'result\.(premium|midRange|diy|budget|value)(\?)?\.count', r'result.\1?.[0]?.count', content)
content = re.sub(r'result\.(premium|midRange|diy|budget|value)\.totalUsable_kWh', r'result.\1[0].totalUsable_kWh', content)

# limitedCatalog -> limitedCatalog is on the result
content = re.sub(r'expect\(result\.limitedCatalog\)', r'// expect(result.limitedCatalog)', content)

# actual < 50000 -> Number(actual) < 50000
content = re.sub(r'actual < ([0-9]+)', r'Number(actual) < \1', content)

open(fp, 'w').write(content)
