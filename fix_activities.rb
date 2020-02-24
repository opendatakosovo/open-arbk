require 'mongo'

'''
    When processing the raw scraped data, the activity codes were converted
    from String to Integers.

    An inappropriate method was used for this convertion in which activity
    codes with leading 0s (e.g. "0123") were interpreted as octal numbers
    rather than decimal. In other words, we did Integer("0123") instead of
    "0123".to_i which, in this case, gave us 83 instead of 123.

    For all businesses with activities codes that have leading zeros in them,
    this script will reset the activity codes list in the formatted subdocument
    to the corrected value.
'''

# Establish connection to database
client = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'arbk')
Mongo::Logger.logger.level = ::Logger::FATAL
$collection_businesses = client[:businesses]


def fix()
    fix_count = 0
    businesses = $collection_businesses.find({'fixed': {'$exists' => false}}).each { |business|
        catch :problematic do
            id = business['_id']
            regnum = business['formatted']['registrationNum'].to_s
            activities = business['raw']['activities']
            activities.each { |activity|
                if activity['key'].start_with?('0')
                    fix_formatted_activities(id, regnum, activities)
                    fix_count += 1
                    throw :problematic
                end
            }
        end
    }

    puts 'Fixed ' + fix_count.to_s + ' documents.'
end

def fix_formatted_activities(id, regnum, activities)
    activity_codes = []

    activities.each { |activity|
        if !activity['key'].empty?
            activity_codes.push(activity['key'].to_i)
        else
            puts 'WARNING: Something\'s up with ' + regnum
        end
    }

    puts 'Fixing: ' + regnum
    # Update/fix document
    $collection_businesses.update_one(
        {'_id' => id},
        {'$set' => {'formatted.activities' => activity_codes, 'fixed' => true}})
end

fix()
